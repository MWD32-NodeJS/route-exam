
import jwt from "jsonwebtoken";
import { tokenSecrets, tokenTypes, tokenExpiry, userRoles } from "./../data.js";


const generate = (id,role=userRoles.user,type=tokenTypes.access) =>
  jwt.sign({id,iat:Date.now()},tokenSecrets[role][type],{expiresIn:tokenExpiry[type]});
export default generate;
