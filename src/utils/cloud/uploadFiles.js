
import uploadFile from "./uploadFile.js";


async function uploadFiles (files = [{ path, folder, public_id }]) {
  const results = [];
  for ( const file of files ) results.push (await uploadFile (file.path, file.folder, file.public_id));
  return results;
};


export default uploadFiles;
