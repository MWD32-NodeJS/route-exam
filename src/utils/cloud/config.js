
import { v2 as cloudinary } from "cloudinary";
import { cloud } from "./../data.js";



cloudinary.config({
  cloud_name: cloud.name,
  api_key: cloud.apiKey,
  api_secret: cloud.apiSecret
});



export default cloudinary;
