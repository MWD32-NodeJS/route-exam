
import { v2 as cloudinary } from "cloudinary";


async function deleteFile ( public_id ) {
  return await cloudinary.uploader.destroy (public_id);
};


export default deleteFile;
