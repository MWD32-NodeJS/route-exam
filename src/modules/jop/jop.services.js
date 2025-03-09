
import jopModel from "./../../db/models/jop.model.js";
import companyModel from "./../../db/models/company.model.js";
import userModel from "./../../db/models/user.model.js";
import response from "./../../utils/response.js";




export async function create ({ body, user, company }, res, next) {
  const jop = new jopModel ({ ...body, addedBy: user._id, companyId: company._id });
  try {
    await jop.save ();
    return next (new response (201, 1, "jop created successfully."))
  } catch (err) {
    if (err.name == "ValidationError")
      return next (new response (400, 0, "validation failed",
        Object.values (err.errors).map ((e) => {
          return { path: e.path, message: e.message }
        })
      ));

    console.log (err);
    return next (new response ());
  }
};


export async function update ({ body, user, params }, res, next) {
  const jop = await jop.findById (params.jopId);
  for (const path of Object.keys (body)) jop[path] = body[path];
  jop.updatedBy = user._id;
  try {
    await jop.save ();
    return next (new response (201, 1, "jop created successfully."))
  } catch (err) {
    if (err.name == "ValidationError")
      return next (new response (400, 0, "validation failed",
        Object.values (err.errors).map ((e) => {
          return { path: e.path, message: e.message }
        })
      ));

    console.log (err);
    return next (new response ());
  }
};


export async function remove ({ params, user }, res, next) {
  const jop = await jopModel.findById (params.jopId);
  if (!jop)
    return next (new response (404, 0, "jop not found."))
  jop.deleteOne ();
  return next (new response (200, 1, "jop deleted successfully."));
};


export async function get ({ params }, res, next) {
  const jop = await jopModel.findById (params.jopId);
  if (!jop)
    return next (new response (404, 0, "jop not found."))
  return next (new response (200, 1, "jop found successfully.", jop));
};
