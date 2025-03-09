
import { Router } from "express";
import * as companyServices from "./company.services.js";
import * as companyValidation from "./company.validation.js";
import validation from "./../../middlewares/validation.middleware.js";
import authentication from "./../../middlewares/authentication.middleware.js";
import { company as isOwner } from "./../../middlewares/authorization.middleware.js";
import parser from "./../../utils/cloud/parser.js";



const router = Router ();

router.route ("/")
.post (
  authentication,
  validation (companyValidation.create),
  parser.fields ([
    { name: "logo", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
    { name: "legalAttachment", maxCount: 1 },
  ]),
  companyServices.create
)

router.route ("/update/:companyId")
.post (
  authentication,
  validation (companyValidation.update),
  isOwner,
  companyServices.update
);

router.route ("/:companyId")
.get (
  authentication,
  validation (companyValidation.softDelete),
  companyServices.get
).delete (
  authentication,
  companyServices.softDelete
);

router.route ("/search/:companyName")
.get (
  authentication,
  validation (companyValidation.search),
  companyServices.search
);

router.route ("/:companyId/logo")
.post (
  authentication,
  isOwner,
  validation (companyValidation.softDelete),
  parser.single ("logo"),
  companyServices.uploadLogo
).delete (
  authentication,
  isOwner,
  validation (companyValidation.softDelete),
  companyServices.deleteLogo
);

router.route ("/:companyId/coverPic")
.post (
  authentication,
  isOwner,
  validation (companyValidation.softDelete),
  parser.single ("coverPic"),
  companyServices.uploadCoverPic
).delete (
  authentication,
  isOwner,
  validation (companyValidation.softDelete),
  companyServices.deleteCoverPic
);



export default router;
