
import { userRoles, tokenTypes, filesFilters, otpTypes, audience, providers } from "../../utils/data.js";
import genToken from "../../utils/token/generate.js";
import verify from "../../utils/token/verify.js";
import axios from "axios";
import mailer from "../../utils/mail/mailer.js";
import compare from "../../utils/hash/compare.js";
import generateMailOptions from "../../utils/mail/generateOptions.js";
import userModel from "../../db/models/user.model.js";
import verifyToken from "../../utils/token/verify.js";
import generateToken from "../../utils/token/generate.js";
import genID from "../../utils/random/id.js";
import log from "../../utils/log/logger.js";
import response from "../../utils/response.js";
import uploadFile from "../../utils/cloud/uploadFile.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();



export async function signup ( req, res, next ) {

  const { firstName, lastName, email, password, DOB, gender, mobileNumber } = req.body;

  const user = new userModel ({ firstName, lastName, email, password, DOB, gender, mobileNumber, iat: Date.now () });

  try {

    user.id = parseInt (genID ());
    while (await userModel.findOne ({ id: user.id })) user.id = parseInt (genID ());

    if (req.files.profilePic) {
      const profilePic = req.files.profilePic[0];
      if (!filesFilters.types[profilePic.mimetype.split ("/")[0]])
        return next (new response (400, 0, "profile picture must be a picture."));
      user.profilePic = await uploadFile (profilePic.path, {
        folder: `users/${user._id}/profile`,
        public_id: `user.${user._id}.profilePicture`  
      });
    };
    if (req.files.coverPic) {
      const coverPic = req.files.coverPic[0]
      if (!filesFilters.types[coverPic.mimetype.split ("/")[0]])
        return next (new response (400, 0, "cover picture must be a picture."));
      user.coverPic = await uploadFile (coverPic.path, {
        folder: `users/${user._id}/profile`,
        public_id: `user.${user._id}.coverPicture`
      });
    };

    await user.save ();
    mailer.emit ("mail", generateMailOptions ("confirm", user.email, { otp: await user.createOTP (otpTypes.confirmEmail) }));
    
    return next (new response ( 201, 1, "user signed up successfully. an otp sent to your email, use it for confirmation." ));

  } catch (err) {

    if (err.name == "ValidationError") return next (new response (
      400, 0, "validation failed.",
      { errors: Object.values (err.errors).map ((e) => { return { path: e.path, message: e.message } }) }
    ))
    else if (err.cause) if (err.cause.code) return next (new response (409, 0, err.message));

    console.log ( err );
    return next (new response ());

  }

};


export async function confirmOTP ( req, res, next ) {

  const { code } = req.query;
  
  for ( const otp of req.user.OTP ) if ( otp.type == otpTypes.confirmEmail ) {
    if ( Date.now () > otp.expiration )
      return next (new response (400, 0, "otp code is expired."));
    else if ( !compare (code, otp.code) )
      return next (new response (400, 0, "otp code is incorrect."));
    else {
      if (req.user.confirmed)
        return next (new response (400, 0, "email is already confirmed."));
      req.user.confirmed = true;
      await req.user.save ();
      return next (new response (200, 1, "email confirmed successfully."));
    }
  };

  return next (new response (404, 0, "otp code is not found."));

};


export async function signin ( req, res, next ) {

  const { email, password } = req.body;

  try {

    const user = await userModel.findOne ({ email, deletedAt: null });
    console.log ("user:", user);
    
    if (!user)
      return next (new response (404, 0, "user not found."));
    else if (user.bannedAt)
      return next (new response (401, 0, "your account is banned by some admin."));
    else if (!compare (password, user.password))
      return next (new response (400, 0, "password is incorrect."));
    else {
      user.iat = Date.now ();
      await user.save ();
      return next (new response (
        201, 1, "user signed in successfully.",
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
            profilePic: user.profilePic.secure_url,
            coverPic: user.coverPic.secure_url
          },
          tokens: {
            access: genToken (user._id, user.role, tokenTypes.access),
            refresh: genToken (user._id, user.role, tokenTypes.refresh)
          }
        }
      ));
    }

  } catch (err) {

    console.log ( err );
    return next (new response ());

  }

};


export async function google ( req, res, next ) {
  
  const { token } = req.query;

  try {

    const ticket = await client.verifyIdToken ({ idToken: token, audience });
    
    const payload = ticket.getPayload ();
    console.log ("user:", payload);

    // const extra = await axios.get ("https://people.googleapis.com/v1/people/me?personFields=birthday,genders", { headers: { Authorization: "Bearer "+payload.at_hash} })
    // console.log (extra);

    if (!payload.email_verified)
      return next (new response (400, 0, "verify your email on google first."))

    let user = await userModel.findOne ({ email: payload.email });
    if (user) { // sign in case
      if (user.provider == providers.system)
        return next (new response (400, 0, "this email is already in use by system provider."));
      user.iat = Date.now ();
      await user.save ();
      return next (new response (
        201, 1, "user logged in successfully.",
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
            profilePic: user.profilePic?.secure_url,
            coverPic: user.coverPic?.secure_url
          },
          tokens: {
            access: genToken (user._id, user.role),
            refresh: genToken (user._id, user.role, tokenTypes.refresh)
          }
        }
      ));
    };
    // sign up case
    user = new userModel ({
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      confirmed: payload.email_verified,
      profilePic: payload.picture,
      provider: providers.google,
      iat: Date.now (),
      id: genID ()
    });
    while (await userModel.findOne ({ id: user.id })) user.id = genID ();
    await user.save ();
    return next (new response (
      201, 1, "user logged in successfully.",
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          profilePic: user.profilePic?.secure_url,
          coverPic: user.coverPic?.secure_url
        },
        tokens: {
          access: genToken (user._id, user.role),
          refresh: genToken (user._id, user.role, tokenTypes.refresh)
        }
      }
    ));

  } catch (err) {

    if (err.message.includes ("Invalid token signature:"))
      return next (new response (400, 0, "token is invalid."))
    else if (err.name.includes ("Token used too late"))
      return next (new response (401, 0, "token is expired."))
    else {
      console.log (err);
      return next (new response ());
    };
      
  }

};


export async function forgetPassword ( req, res, next ) {

  mailer.emit ("mail", generateMailOptions ("forget", req.user.email, { otp: await req.user.createOTP (otpTypes.forgetPassword) }));
  return next (new response (200, 1, "an otp code was sent to your email, use it to reset your password."))

}; // send an otp


export async function resetPassword ( req, res, next ) {

  const { code } = req.query;
  const { password } = req.body;

  for ( const otp of req.user.OTP ) if ( otp.type == otpTypes.forgetPassword ) {
    console.log ("expiration", otp.expiration);
    console.log ("Date.now ()", Date.now ());
    console.log ("expiry", otp.expiration - Date.now ());
    if ( Date.now () > otp.expiration )
      return next (new response (400, 0, "otp code is expired."));
    else if ( !compare (code, otp.code) )
      return next (new response (400, 0, "otp code is incorrect."));
    else {
      req.user.password = password;
      try {
        await req.user.save ();
        return next (new response (200, 1, "password changed successfully."));
      }
      catch (err) {
        if (err.name == "ValidationError")
          return next (new response (400, 0, Object.values(err.errors)[0].message))
        else return next (new response ());
      };
    }
  };

  return next (new response (404, 0, "otp code is not found."));

};


export async function accessToken ( req, res, next ) {

  const { role, token } = req.query;
  
  try {

    const { id } = verifyToken (token, role, tokenTypes.refresh);
    const user = await userModel.findById (id);
    
    if (!user)
      return next (new response (404, 0, "user not found, your account may be deleted by some admin."));

    user.iat = Date.now ();
    await user.save ();

    return next (new response (201, 1, null, { token: generateToken (id, role, tokenTypes.access) }))

  } catch (err) {

    if (err.name == "TokenExpiredError")
      return next (new response (401, 0, "logged out, log in again."));
    else if (err.name == "JsonWebTokenError")
      return next (new response (400, 0, "token is invalid."))

    console.log (err);
    return next (new response ());

  }

};
