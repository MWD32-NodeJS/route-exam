
import multer from "multer";
import { filesFilters as filter } from "./../data.js";
import response from "./../response.js";


const parser = multer ({

  storage: multer.diskStorage ({}),
  
  fileFilter: (req, file, cb) => {

    if (!file) return cb (new response (404, 0, "file not found."), 0);
    const [ type, extension ] = file.mimetype.split("/");

    if (!filter.types[type]) return cb (new response (400, 0, "file with this type can't be used for this."), 0)
    else if (!filter.types[type].includes (extension)) return cd (new response (
      400, 0, `${type} files supported extensions are ${filter.types[type].join(", ")}`
    ), 0)
    else if (filter.sizes[type] < file.size) return cb (new response (
      400, 0, `${type} files size should be less than ${filter.sizes[type] / 1024 / 1024}MB.`
    ), 0)

    return cb (null, true);

  }

});


export default parser;
