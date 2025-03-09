
import cloudinary from "./config.js";


async function uploadFile ( path, options = { folder, public_id } ) {
  const { secure_url, public_id } = await cloudinary.uploader.upload (path, options);
  return { secure_url, public_id };
};


export default uploadFile;
