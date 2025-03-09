
import response from "./../utils/response.js";


async function notFoundRequest ( req, res, next ) {

  return next (new response ( 404, 0, "request not found." ));

};
export default notFoundRequest;
