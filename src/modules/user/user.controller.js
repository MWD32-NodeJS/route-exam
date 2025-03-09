
import { Router } from "express";
import authentication from "./../../middlewares/authentication.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import * as userServices from "./user.services.js";
import parser from "./../../utils/cloud/parser.js";



const router = Router ();
router.use (authentication);

router.route ("/")
.get (
  userServices.profile
);

router.route ("/profile")
.get (
  userServices.find
);

router.route ("/update")
.post (
  validation (userValidation.update),
  userServices.update
);
router.route ("/update/password")
.post (
  validation (userValidation.updatePassword),
  userServices.updatePassword
);

router.route ("/profilePic")
.post (
  parser.single ("picture"),
  userServices.updateProfilePic
)
.delete (
  userServices.deleteProfilePic
);
router.route ("/coverPic")
.post (
  parser.single ("picture"),
  userServices.updateCoverPic
)
.delete (
  userServices.deleteCoverPic
);



export default router;
