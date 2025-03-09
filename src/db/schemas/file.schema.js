
import { Schema } from "mongoose";


const fileSchema = new Schema ({
  secure_url: {
    type: String,
    required: [ true, "secure_url is required." ]
  },
  public_id: {
    type: String,
    required: [ true, "public_id is required." ]
  }
}, { timestamps: true });

export default fileSchema;
