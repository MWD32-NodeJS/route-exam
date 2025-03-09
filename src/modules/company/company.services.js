
import companyModel from "./../../db/models/company.model.js";
import userModel from "./../../db/models/user.model.js";
import uploadFile from "./../../utils/cloud/uploadFile.js";
import deleteFile from "./../../utils/cloud/deleteFile.js";
import response from "./../../utils/response.js";



export async function create ( req, res, next ) {

  const company = new companyModel ({
    owner: req.user._id,
    name: req.body.name,
    description: req.body.description,
    industry: req.body.industry,
    address: req.body.address,
    employeesRange: req.body.employeesRange,
    email: req.body.email,
  });

  try {
    
    if (req.files) for ( const file of Object.keys (req.files) ) company[file] = await uploadFile (
      req.files[file].path,
      { folder: `companies/${company._id}`, public_id: `company.${file}` }
    );
    await company.save ();
    
    return next (new response (201, 1, "company created successfully.", {
      name: company.name,
      description: company.description,
      industry: company.industry,
      email: company.email,
      employeesRange: company.employeesRange,
      address: company.address,
      logo: company.logo?.secure_url,
      coverPic: company.coverPic?.secure_url,
      legalAttachment: company.legalAttachment?.secure_url
    }));

  } catch (err) {

    if (company.logo) await deleteFile (company.logo.public_id);
    if (company.coverPic) await deleteFile (company.coverPic.public_id);
    if (company.legalAttachment) await deleteFile (company.legalAttachment.public_id);
    
    if (err.name == "ValidationError")
      return next (new response (
        400, 0, "validation failed.",
        Object.values (err.errors).map ((e) => {
          return { path: e.path, message: e.message }
        })
      ))
    else if (err.name == "MongooseError")
      return next (new response (400, 0, err.message));
      
    console.log (err);
    return next (new response ());

  }


};


export async function update ( { body, user, company }, res, next ) {

  company.HRs = [];
  console.log ("loop finished");
  for ( const email of body.HRs ) {
    console.log ("hr email:", email);
    const hr = await userModel.findOne ({ email }); // search about the hr by email.
    if (!hr) return next (new response (404, 0, `unable to find user with email ${email}`));
    company.HRs.push (hr._id);
  };
  delete body.HRs; // don't change company.HRS in the following for loop
  for ( const path of Object.keys (body) ) company[path] = body[path];
  console.log ("loop finished");
  
  try {
    console.log ("comapny to save ...", company)
    await company.save ();
    console.log ("company  saved");
    // populate the emails in company.HRs and get firstName lastName username email confirmed profilePic 

    console.log ("company population:", company);
    return next (new response (200, 1, "company updated successfully", await companyModel.findById (company._id).populate ("HRs", "-_id -role -iat -OTP -createdAt -updatedAt -__v -password")));
  } catch (err) {
    console.log ("err", err);
    if (err.name == "ValidationError")
      return next (new response (
        400, 0, "validation failed.",
        Object.values (err.errors).map ((e) => {
          return { path: e.path, message: e.message }
        })
      ))
    else if (err.name == "MongooseError")
      return next (new response (409, 0, err.message));

    return next (new response ());
  }

};


export async function softDelete ( { params, user }, res, next ) {
  const company = await companyModel.findById (params.companyId);
  if (!company)
    return next (new response (404, 0, "company not found."))
  else if (company.deletedAt)
    return next (new response (400, 0, "company is already deleted."))
  else if (user.id != company.owner.toString () || user.role == userRoles.user)
    return next (new response (401, 0, "you don't have an acceess to do this.")); //you can't delete a company witch is banned by admin

  company.deletedAt = Date.now ();
  await company.save ();
  return next (new response (200, 1, "company deleted successfully."));
};


export async function get ( { params }, res, next ) {
  const company = await companyModel.findById (params.companyId).select ("jops");

  if (!company)
    return next (new response (404, 0, "company not found."))
  else if (company.deletedAt)
    return next (new response (404, 0, "company is deleted."))
  else if (company.bannedAt)
    return next (new response (401, 0, "company is banned."))
  else if (!company.jops)
    return next (new response (404, 0, "this company doesn't have any jops yet."));

  return next (new response (200, 1, "copmany jops found successfully.", company.jops))
};


export async function search ( { params }, res, next ) {
  const company = await companyModel.findOne ({ name: params.companyName }).populate ("HRs", "-_id -iat -OTP -role -__v -deletedAt -bannedAt -createdAt -updatedAt -password");
  if (!company)
    return next (new response (404, 0, "company not found."))
  else if (company.deletedAt)
    return next (new response (404, 0, "company was deleted."))
  else if (company.bannedAt)
    return next (new response (401, 0, "company is banned."))

  company.deletedAt = null;
  company.bannedAt = null;
  return next (new response (200, 1, "company found successfully.", company))
};


export async function uploadLogo ( { file, company }, res, next ) {
  if (!file)
    return next (new response (404, 0, "no file sent"))
  else if (file.mimetype.split ("/")[0] != "image")
    return next (new response (400, 0, "file must be a valid picture."))
  
  company.logo = await uploadFile (file.path, { folder: `companies/${company.id}`, public_id: "company.logo" });
  await company.save ();
  return next (new response (200, 1, "company logo updated successfully.", company.logo.secure_url));
};


export async function deleteLogo ( { company }, res, next ) {
  if (!company.logo)
    return next (new response (404, 0, "company logo not found."));
  company.logo = null;
  await company.save ();
  return next (new response (200, 1, "company logo deleted successfully."));
};


export async function uploadCoverPic ( { file, company }, res, next ) {
  if (!file)
    return next (new response (404, 0, "no file sent"))
  else if (file.mimetype.split ("/")[0] != "image")
    return next (new response (400, 0, "file must be a valid picture."))
  
  company.coverPic = await uploadFile (file.path, { folder: `companies/${company.id}`, public_id: "company.coverPic" });
  await company.save ();
  return next (new response (200, 1, "company coverPic updated successfully.", company.coverPic.secure_url));
};


export async function deleteCoverPic ( { company }, res, next ) {
  if (!company.coverPic)
    return next (new response (404, 0, "company coverPic not found."));
  company.coverPic = null;
  await company.save ();
  return next (new response (200, 1, "company coverPic deleted successfully."));
};
