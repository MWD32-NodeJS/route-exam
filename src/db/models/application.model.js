
import mongoose from "mongoose";
import { applicationStatus } from "./../../utils/data.js";



const schema = new mongoose.Schema ({

  jopId: { type: mongoose.Types.ObjectId, ref: "Jop" },
  
  userId: { type: mongoose.Types.ObjectId, ref: "User" },

  userCV: fileSchema,

  status: {
    type: String,
    default: applicationStatus.pending,
    enum: {
      values: Object.values (applicationStatus),
      values: `application status must be ${Object.values (applicationStatus).join (", ")}.`
    }
  }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });



const model = mongoose.model ("Application", schema);
export default model;
