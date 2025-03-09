
import mongoose from "mongoose";
import messageSchema from "./../schemas/message.schema.js";
import companyModel from "./company.model.js";



const schema = new mongoose.Schema ({
  
  senderId: { type: mongoose.Types.ObjectId, ref: "User" },
  companyId: { type: mongoose.Types.ObjectId, ref: "Company" },

  recieverId: { type: mongoose.Types.ObjectId, ref: "User" },

  messages: [messageSchema]

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

schema.pre ("save", async (next) => {
  if (this.isNew) {
    const company = await companyModel.findById (this.companyId).select ("HRs");
    for ( const hr of company.HRs ) if (hr._id.toString () == senderId.toString ()) next ();
    throw new Error ("you are not an HR employee in this company.", {cause: 400});
  }
});



const model = mongoose.model ("Chat", schema);
export default model;
