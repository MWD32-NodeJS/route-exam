
import joi from "joi";
import { genders, userRoles } from "./../../utils/data.js";



const schema = {

  firstName: joi.string ().min (3).max (25).trim ().messages ({
    "any.required": "firstName is required.",
    "string.base": "firstName must be a type of string.",
    "string.min": "firstName must be at least 3 chars.",
    "string.max": "firstName must be at most 25 chars.",
    "string.trim": "firstName mustn't include whitespaces on the sides."
  }),
  
  lastName: joi.string ().min (3).max (25).trim ().messages ({
    "any.required": "lastName is required.",
    "string.base": "lastName must be a type of string.",
    "string.min": "lastName must be at least 3 chars.",
    "string.max": "lastName must be at most 25 chars.",
    "string.trim": "lastName mustn't include whitespaces on the sides."
  }),
  
  email: joi.string ().trim ().lowercase ().email ().messages ({
    "any.required": "email is required.",
    "string.base": "email must be a type of string.",
    "string.lowercase": "email must be lowercased.",
    "string.email": "email is invalid.",
    "string.trim": "lastName mustn't include whitespaces on the sides."
  }),
  
  password: joi.string ().min (8).max (18).pattern (/^[a-zA-Z0-9_!@#$%&*.]+$/).messages ({
    "any.required": "password is required.",
    "string.base": "password must be a type of string.",
    "string.min": "password must be at least 8 chars.",
    "string.max": "password must be at most 18 chars.",
    "string.pattern.base": "password must be alphanumeric (special chars and numbers allowed)."
  }),
  
  gender: joi.string ().valid (...Object.values (genders)).messages ({
    "any.required": "gender is required.",
    "string.base": "gender must be a type of string.",
    "any.only": `gender must be ${Object.values (genders).join (", ")}`
  }),

  DOB: joi.date ().max (new Date (Date.now () - 18*265.25*24*60*60*1000)).messages ({
    "any.required": "DOB is required.",
    "date.base": "DOB must be a type of date.",
    "date.max": "your age must be at least 18 year.",
  }),
  
  mobileNumber: joi.string ().length (11).messages ({
    "any.required": "mobileNumber is required.",
    "string.base": "mobileNumber must be a type of string.",
    "string.length": "mobileNumber must be 11 chars length.",
  }),

  otp: joi.string ().length (6).messages ({
    "any.required": "otp code is required.",
    "string.base": "otp code must be a type of string.",
    "string.length": "otp code must be 6 chars length."
  }),

  role: joi.string ().valid (...Object.values (userRoles)).messages ({
    "any.required": "role is required.",
    "string.base": "role must be a type of string.",
    "any.only": `role must be ${Object.values (userRoles).join (", ")}.`
  }),

  token: joi.string ().messages ({
    "any.required": "token is required.",
    "string.base": "token must be a type of string."
  }),

  profilePic: joi.any (),
  coverPic: joi.any (),

};



export const signup = {
  body: joi.object ({
    firstName: schema.firstName.required (),
    lastName: schema.lastName.required (),
    email: schema.email.required (),
    password: schema.password.required (),
    gender: schema.gender.required (),
    DOB: schema.DOB.required (),
    mobileNumber: schema.mobileNumber,
    profilePic: schema.profilePic,
    coverPic: schema.coverPic
  }).required (),
};


export const confirmOTP = {
  query: joi.object ({
    code: schema.otp.required ()
  }).required ()
};


export const signin = {
  body: joi.object ({
    email: schema.email.required (),
    password: schema.password.required ()
  }).required (),
};


export const google = {};


export const forgetPassword = {};


export const resetPassword = {
  body: joi.object ({
    password: schema.password.required ()
  }).required (),
  query: joi.object ({
    code: schema.otp.required ()
  }).required ()
};


export const accessToken = {
  query: joi.object ({ role: schema.role.required (), token: schema.token.required () }).required (),
};
