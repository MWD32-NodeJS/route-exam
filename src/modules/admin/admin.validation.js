
import joi from "joi";


const schema = {
  Authorization: joi.string ().messages ({
    "any.required": "Authorization is required.",
    "string.base": "Authorization must be a type of string.",
  }),
  userId: joi.string ().length (24).pattern (/^[a-z0-9]+$/).messages ({
    "any.required": "userId is required.",
    "string.length": "userId must be 24 chars length.",
    "string.base": "userId must be a type of string.",
    "string.pattern.base": "userId is invalid."
  }),
  companyId: joi.string ().length (24).pattern (/^[a-z0-9]+$/).messages ({
    "any.required": "companyId is required.",
    "string.length": "companyId must be 24 chars length.",
    "string.base": "companyId must be a type of string.",
    "string.pattern.base": "companyId is invalid."
  })
};


export const getDataValidation = joi.object ({ Authorization: schema.Authorization.required () }).required ();

export const usersBannerValidation = joi.object ({
  Authorization: schema.Authorization.required (),
  userId: schema.userId.required ()
}).required ();


export const companiesBannerValidation = joi.object ({
  Authorization: schema.Authorization.required (),
  companyId: schema.companyId.required ()
}).required ();

export const companiesApproverValidation = joi.object ({
  Authorization: schema.Authorization.required (),
  companyId: schema.companyId.required ()
}).required ();
