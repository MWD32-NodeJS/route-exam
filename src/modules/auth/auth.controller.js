
import { Router } from "express";
import * as services from "./auth.services.js";
import parser from "./../../utils/cloud/parser.js";
import authentication from "./../../middlewares/authentication.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import * as validationSchemas from "./auth.validation.js";



const router = Router ();

// auth routes
router.route ("/signup")
.post (
  parser.fields ([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 }
  ]),
  validation (validationSchemas.signup),
  services.signup
);
router.route ("/confirmOTP")
.get (
  authentication,
  validation (validationSchemas.confirmOTP),
  services.confirmOTP
);

router.route ("/signin")
.post (
  validation (validationSchemas.signin),
  services.signin
);

// router.route ("/google")
// .get (
  // validation (validationSchemas.google),
  // services.google
// );
// router.route ("/template/google")
// .get (( req, res ) => res.status(200).sendFile ("C:/Users/mwd32developer/Desktop/Exam/googleAuth.html"));

router.route ("/forgetPassword")
.get (
  validation (validationSchemas.forgetPassword),
  authentication,
  services.forgetPassword
);
router.route ("/resetPassword")
.post (
  validation (validationSchemas.resetPassword),
  authentication,
  services.resetPassword
);

router.route ("/accessToken")
.get (
  validation (validationSchemas.accessToken),
  services.accessToken
);

// change routes



export default router;
