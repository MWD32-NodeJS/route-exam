
import { Router } from "express";
import authentication from "./../../middlewares/authentication.middleware";
import * as jopServices from "./jop.services.js";



const router = Router ();

router.route ("/:companyId")
.post (
  authentication,
  // validation (jopValidation.create),
  // companyAdmin,
  jopServices.create
).delete (
  authentication,
  // validation (jopValidation.delete),
  // companyAdmin,
  jopServices.remove
);

router.route ("/update/:companyId")
.get (
  authentication,
  jopServices.get
)




export default router;
