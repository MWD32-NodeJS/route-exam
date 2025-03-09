
import mongoose from "mongoose";
import { colors, uri } from "./../utils/data.js";
import log from "./../utils/log/logger.js";



async function connect () {

  try {

    await mongoose.connect (uri);

    log ("Mongoose Connected Successfully");


  } catch (err) {

    log ("Mongoose Connection Error", colors.red);

    log (err, colors.red);

  }

};
export default connect;
