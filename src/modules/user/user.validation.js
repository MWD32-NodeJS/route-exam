
import joi from "joi";
import { genders } from "./../../utils/data.js";


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

};



export const update = {
  body: joi.object ({
    firstName: schema.firstName,
    lastName: schema.lastName,
    DOB: schema.DOB,
    mobileNumber: schema.mobileNumber,
    gender: schema.gender,
  }).required ()
};


export const find = { query: joi.object ({ email: schema.email }).required () };


export const updatePassword = {
  body: {
    password: schema.password.required (),
    update: schema.password.required (),
  }
};
