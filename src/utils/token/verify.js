
import { userRoles, tokenSecrets } from "./../data.js";
import jwt from "jsonwebtoken";


const verify = ( token, role, type ) => jwt.verify (token, tokenSecrets[role][type]);
export default verify;
