
import mongoose from "mongoose";
import fileSchema from "./../schemas/file.schema.js";



const schema = new mongoose.Schema ({

  name: {
    type: String,
    required: [ true, "company name is required." ],
    minLength: [ 3, "name must be at least 3 characters." ],
    maxLength: [ 50, "name must be at most 50 characters." ],
    trim: true,
    unique: [ true, "company with this name is already exists." ],
  },

  description: {
    type: String,
    trim: true,
    maxLength: [ 650, "description must be less than 650 characters." ],
  },

  industry: {
    type: String,
    trim: true,
    minLength: [ 3, "industry must be at least 3 chars." ]
  },
  address: String,
  employeesRange: String,

  email: {
    type: String,
    required: [ true, "company email is required." ],
    trim: true,
    lowercase: true,
    unique: [ true, "company email is already exists." ],
    isEmail: [ true, "email is invalid." ],
  },

  owner: { type: mongoose.Types.ObjectId, ref: "User" },

  logo: fileSchema,
  coverPic: fileSchema,

  HRs: [{ type: mongoose.Types.ObjectId, ref: "User" }],

  bannedAt: Date,
  deletedAt: Date,

  legalAttachment: fileSchema,

  approved: Boolean
  
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });



const model = mongoose.model ("Company", schema);
export default model;
