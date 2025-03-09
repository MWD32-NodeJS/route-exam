
import { Schema } from "mongoose";
import fileSchema from "./file.schema.js";



const messageSchema = new Schema ({

  userId: { type: Types.ObjectId, ref: "User" },

  content: {
    type: String,
    required: () => this.files ? false : [ true, "message must include a text or a file." ],
    minLength: [ 1, "message content can't be empty." ]
  },
  files: [fileSchema]

}, { timestamps: true, toJSON: true, toObject: true });



export default messageSchema;
