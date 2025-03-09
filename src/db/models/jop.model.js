
import mongoose from "mongoose";
import { jopLocations, workingTimes, seniorityLevel } from "./../../utils/data.js";



const schema = new mongoose.Schema ({

  jopTitle: { type: String, required: true },
  
  jopLocation: {
    type: String,
    default: jopLocations.remote,
    enum: {
      values: Object.values (jopLocations),
      message: `jop location must be ${Object.values (jopLocations).join (", ")}.`
    },
    required: true,
  },
  
  workingTime: {
    type: String,
    default: workingTimes.partTime,
    enum: {
      values: Object.values (workingTimes),
      message: `working time must be ${Object.values (workingTimes).join (", ")}.`
    },
    required: true,
  },
  
  seniorityLevel: {
    type: String,
    default: seniorityLevel.fresh,
    enum: {
      values: Object.values (seniorityLevel),
      message: `seniorityLevel must be ${Object.values (seniorityLevel)}.`
    }
  },

  jopDescription: {
    type: String,
    maxLength: [ 400, "jopDescription must be at most 400 char." ]
  },

  technicalSkills: [{
    type: String,
    trim: true,
    maxLength: [ 30, "skill must be at most 30 chars." ]
  }],
  softSkills: [{
    type: String,
    trim: true,
    maxLength: [ 30, "skill must be at most 30 chars." ]
  }],

  addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  closed: Boolean,
  companyId: { type: mongoose.Types.ObjectId, ref: "Company" },

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });



const model = mongoose.model ("Jop", schema);
export default model;
