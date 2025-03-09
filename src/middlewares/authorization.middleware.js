
import companyModel from "./../db/models/company.model.js";
import response from "./../utils/response.js";



export async function company ( req, res, next ) {
  req.company = await companyModel.findById (req.params.companyId);
  
  if (!req.company)
    return next (new response (404, 0, "company not found."))
  else if (req.company.owner.toString () != req.user.id)
    return next (new response (401, 0, "you are not the owner of this company."))
  else if (req.company.deletedAt)
    return next (new response (401, 0, "company is deleted by some admin."))
  else if (req.company.bannedAt)
    return next (new response (401, 0, "company is banned by some admin."));

  next ();
};


