
import verify from "./../../../utils/token/verify.js";
import { userRoles, tokenTypes } from "./../../../utils/data.js";
import userModel from "./../../../db/models/user.model.js";



async function authentication (authorization) {

  const [ role, token ] = authorization.split (" ");
  if (!role || !token)
    return { success: 0, message: "authorization is invalid.", status: 400 }
  else if (!userRoles[role])
    return { success: 0, status: 400, message: "role is invalid."}
  else if (role == userRoles.user)
    return { success: 0, status: 401, message: "you don't have access to do this." };

  try {
    const { id, iat } = verify (token, role, tokenTypes.access);    
    const user = await userModel.findById (id);
    if (!user)
      return { success: 0, status: 404, message: "user not found." }
    else if (user.deletedAt)
      return { success: 0, status: 404, message: "your account has been deleted by some admin." }
    else if (user.bannedAt)
      return { success: 0, status: 401, message: "your account has been banned by some admin." }
    else if (user.iat > iat)
      return { success: 0, status: 401, message: "token is expired." }
    return user
  } catch (err) {
    console.log ("err:", err);
    if (err.name == "TokenExpiredError")
      return { success: 0, status: 401, message: "token is expired." }
    else if (err.name == "JsonWebTokenError")
      return { success: 0, status: 401, message: "token is invalid." }
    else return { success: 0, status: 500, message: "something went wrong." }
  };

};


export default authentication;
