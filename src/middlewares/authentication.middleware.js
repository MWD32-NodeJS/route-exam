
import userModel from "./../db/models/user.model.js";
import response from "./../utils/response.js";
import verifyToken from "./../utils/token/verify.js";
import { tokenTypes, userRoles } from "./../utils/data.js";



async function authentication ( req, res, next ) {

  if (!req.headers.authorization) return next (new response (404, 0, "authorization header is required."));

  const [ role, token ] = req.headers.authorization.split (" ");
  if (!role || !token) return next (new response (404, 0, "authorization header is invalid."));
  else if (!userRoles[role]) return next (new response (400, 0, "role is invalid."));

  try {

    const { id, iat } = verifyToken (token, role, tokenTypes.access);
    req.user = await userModel.findById (id);
    if (!req.user || req.user.deletedAt)
      return next (new response (404, 0, "user not found, your account may be deleted by some admin."));
    else if (req.user.bannedAt)
      return next (new response (401, 0, "your account has been banned by some admin."));
    else if (req.user.changeCredentialTime > iat)
      return next (new response (401, 0, "token is expired."));

    next (); // continue pipeline

  } catch (err) {

    console.log (err);
    if (err.name == "TokenExpiredError")
      return next (new response (401, 0, "token is expired."));
    else if (err.name == "JsonWebTokenError")
      return next (new response (401, 0, "token is invalid."));

    return next (new response ());

  }

};


export default authentication;
