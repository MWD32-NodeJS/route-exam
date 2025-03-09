
import { Schema } from "mongoose";
import { otpTypes, otpExpiry } from "./../../utils/data.js";


const otpSchema = new Schema ({

  code: { type: String, required: true },

  type: {
    type: String,
    required: true,
    enum: {
      values: Object.values (otpTypes),
      message: `type must be ${Object.values (otpTypes).join (", ")}.`
    },
    default: otpTypes.confirmEmail
  }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

otpSchema.virtual ("expiration").get (function () { return new Date (this.createdAt).getTime () + otpExpiry[this.type] });


export default otpSchema;
