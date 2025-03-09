
import joi from "joi";



const schema = {
  name: joi.string ().min (3).max (25).trim ().messages ({
    "any.required": "name is required.",
    "string.base": "name must be a type of string.",
    "string.min": "name must be at least 3 chars.",
    "string.max": "name must be at most 25 chars.",
    "string.trim": "name mustn't include whitespaces on the sides."
  }),
  description: joi.string ().max (650).trim ().messages ({
    "any.required": "description is required.",
    "string.base": "description must be a type of string.",
    "string.max": "description must be at most 650 chars.",
    "string.trim": "description mustn't include whitespaces on the sides."
  }),
  industry: joi.string ().trim ().min (3).messages ({
    "any.required": "industry is required.",
    "string.base": "industry must be a type of string.",
    "string.min": "industry must be at least 3 chars.",
    "string.trim": "industry mustn't include whitespaces on the sides."
  }),
  address: joi.string ().trim ().messages ({
    "any.required": "address is required.",
    "string.base": "address must be a type of string.",
    "string.trim": "address mustn't include whitespaces on the sides."
  }),
  employeesRange: joi.string ().trim ().pattern (/^[0-9]{1,2}-[0-9]{1,2}$/).messages ({
    "any.required": "employeesRange is required.",
    "string.base": "employeesRange must be a type of string.",
    "string.trim": "employeesRange mustn't include whitespaces on the sides.",
    "string.pattern.base": "employeesRange must be in this format: 5-12"
  }),
  email: joi.string ().email ().trim ().lowercase ().messages ({
    "any.required": "email is required.",
    "string.base": "email must be a type of string.",
    "string.email": "email is invalid.",
    "string.lowercase": "email must be lowercased.",
    "string.trim": "email mustn't include whitespaces on the sides."
  }),
  owner: joi.string ().length (24).trim ().pattern (/^[a-z0-9]+$/).messages ({
    "any.required": "owner is required.",
    "string.length": "owner must be 24 chars length.",
    "string.base": "owner must be a type of string.",
    "string.trim": "owner mustn't include whitespaces on the sides.",
    "string.pattern.base": "owner is invalid."
  }),
  logo: joi.string ().trim ().messages ({
    "any.required": "logo is required.",
    "string.base": "logo must be a type of string.",
    "string.trim": "logo mustn't include whitespaces on the sides."
  }),
  coverPic: joi.string ().trim ().messages ({
    "any.required": "coverPic is required.",
    "string.base": "coverPic must be a type of string.",
    "string.trim": "coverPic mustn't include whitespaces on the sides."
  }),
  HRs: joi.array ().items (joi.string ().email ().trim ().lowercase ().messages ({
    "string.length": "HR must be 24 chars length.",
    "string.base": "HR must be a type of string.",
    "string.trim": "HR mustn't include whitespaces on the sides.",
    "string.email": "HR is invalid.",
    "string.lowercase": "HR must be lowercased."
  })).messages ({
    "any.required": "HRs is required.",
    "array.base": "HRs must be an array.",
  }),
  companyId: joi.string ().length (24).trim ().pattern (/^[a-z0-9]+$/).messages ({
    "any.required": "companyId is required.",
    "string.length": "companyId must be 24 chars length.",
    "string.base": "companyId must be a type of string.",
    "string.trim": "companyId mustn't include whitespaces on the sides.",
    "string.pattern.base": "companyId is invalid."
  })
};



export const create = {
  body: joi.object ({
    name: schema.name.required (),
    description: schema.description.required (),
    industry: schema.industry.required (),
    address: schema.address.required (),
    employeesRange: schema.employeesRange.required (),
    email: schema.email.required (),
  }).required ()
};


export const update = {
  body: joi.object ({
    name: schema.name.required (),
    description: schema.description.required (),
    industry: schema.industry.required (),
    address: schema.address.required (),
    employeesRange: schema.employeesRange.required (),
    email: schema.email.required (),
  }).required (),
  params: joi.object ({ companyId: schema.companyId.required () }).required ()
};


export const softDelete = {
  params: joi.object ({ companyId: schema.companyId.required () }).required ()
};


export const search = {
  params: joi.object ({ companyName: schema.name.required () }).required ()
};
