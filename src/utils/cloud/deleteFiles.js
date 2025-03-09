
import deleteFile from "./deleteFile.js";


async function deleteFiles (files = [{ public_id }]) {
  for ( const public_id of files ) await deleteFile (public_id);
};


export default deleteFiles;
