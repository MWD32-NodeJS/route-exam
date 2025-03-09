
import userModel from "./../../db/models/user.model.js";
import response from "./../../utils/response.js";
import compare from "./../../utils/hash/compare.js";
import uploadFile from "./../../utils/cloud/uploadFile.js";
import deleteFile from "./../../utils/cloud/deleteFile.js";



export async function update ( req, res, next ) {

  // const { mobileNumber, DOB, firstName, lastName, gender } = req.body;
  for ( const path of Object.keys (req.body) ) req.user[path] = req.body[path];
  req.user.updatedBy = req.user._id;
  
  try {
    await req.user.save ();
    return next (new response (200, 1, `${Object.keys (req.body).join (", ")} changed successfully.`));
  } catch (err) {

    if (err.name == "ValidationError")
      return next (new response (
        400, 0, "validation failed.",
        { errors: Object.values (err.errors).map ((e) => { return { path: e.path, message: e.message } }) }
      ));
    
    console.log (err);
    return next (new response ());

  }

};


export async function profile ( req, res, next ) {

  return next (new response (200, 1, null, {
    username: req.user.username,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    confirmed: req.user.confirmed,
    mobileNumber: req.user.mobileNumber,
    gender: req.user.gender,
    DOB: req.user.DOB,
    profilePic: req.user.profilePic.secure_url,
    coverPic: req.user.coverPic.secure_url,
  }));

};


export async function find ( req, res, next ) {
  
  if (req.user.email == req.query.email) // your account won't appear in the search results
  return next (new response (400, 0, "no user matched."));
  
  const user = await userModel.findOne ({ email: req.query.email }).select ("firstName lastName username mobileNumber profilePic coverPic -_id");
  
  if (!user)
    return next (new response (404, 0, "no user matched."));

  return next (new response (200, 1, "user found successfully.", {
    username: user.username,
    mobileNumber: user.mobileNumber,
    profilePic: user.profilePic.secure_url,
    coverPic: user.coverPic.secure_url,
  }))

};


export async function updatePassword ( req, res, next ) {
  
  const { password, update } = req.body;
  
  if (!compare (password, req.user.password))
    return next (new response (400, 0, "password is incorrect."))
  else if (password == update)
    return next (new response (400, 0, "password is the same."))
  
  req.user.updatedBy = req.user._id;
  req.user.password = update;
  try { await req.user.save () }
  catch (err) {
    if (err.name == "ValidationError")
      return next (new response (400, 0, Object.values(err.errors)[0].message));
    return next (new response ());
  };

  return next (new response (200, 1, "password changed successfully."));

};


export async function updateProfilePic ( req, res, next ) {

  if (!req.file)
    return next (new response (404, 0, "picture not found."))
  else if (req.file.mimetype.split ("/")[0] != "image")
    return next (new response (400, 0, "please, send a valid picture."));
  
  try {
    
    if (req.user.profilePic.public_id != "defaultProfilePicture") await deleteFile (`users/${req.user._id}/profile/profilePicture`);
    req.user.profilePic = await uploadFile (req.file.path, { folder: `users/${req.user._id}/profile`, public_id: `profilePicture` });
    req.user.updatedBy = req.user._id;
    await req.user.save ();
    return next (new response (200, 1, "profile picture updated successfully.", { picture: req.user.profilePic.secure_url }));
    
  } catch (err) {
    console.log (err);
    return next (new response ());
  }
  
};


export async function updateCoverPic ( req, res, next ) {

  if (!req.file)
    return next (new response (404, 0, "picture not found."))
  else if (req.file.mimetype.split ("/")[0] != "image")
    return next (new response (400, 0, "please, send a valid picture."));
  
  try {
    
    if (req.user.coverPic.public_id != "defaultCoverPicture") await deleteFile (`users/${req.user._id}/profile/coverPicture`);
    req.user.coverPic = await uploadFile (req.file.path, { folder: `users/${req.user._id}/profile`, public_id: `coverPicture` });
    req.user.updatedBy = req.user._id;
    await req.user.save ();
    return next (new response (200, 1, "cover picture updated successfully.", { picture: req.user.coverPic.secure_url }));
    
  } catch (err) {
    console.log (err);
    return next (new response ());
  }
  
};


export async function deleteProfilePic ( req, res, next ) {
  
  if (req.user.profilePic.public_id == "defaultProfilePicture")
    return next (new response (400, 0, "profilePic not found.")); // you can' delete the default picture
  await deleteFile (req.user.profilePic.public_id);
  
  req.user.updatedBy = req.user._id;
  req.user.profilePic = undefined;
  await req.user.save ();
  return next (new response (200, 1, "profilePic deleted successfully."));
  
};


export async function deleteCoverPic ( req, res, next ) {
  
  if (req.user.coverPic.public_id == "defaultCoverPicture")
    return next (new response (400, 0, "coverPic not found.")); // you can' delete the default picture
  await deleteFile (req.user.profilePic.public_id);
  
  req.user.updatedBy = req.user._id;
  req.user.coverPic = undefined;
  await req.user.save ();
  return next (new response (200, 1, "coverPic deleted successfully."));

};


export async function softDeleteAccount ( req, res, next ) {};

