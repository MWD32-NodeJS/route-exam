
import response from "./../utils/response.js";

export default ( schemas ) => {

  return ( req, res, next ) => {
    
    const results = [];
    
    for ( const key of Object.keys (schemas) ) {
      const { error } = schemas[key].validate (req[key], { abortEarly: false });
      if (error) results.push (...error.details.map ((e) => { return { location: key, path: e.path[0], message: e.message } }));
    };
    
    if (results.length) return next (new response (400, 0, "validation failed.", { errors: results }));
    next ();
    
  }

};
