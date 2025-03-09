
import mongoose from "mongoose";
import fileSchema from "./../schemas/file.schema.js";
import genOTP from "./../../utils/random/otp.js";
import decrypt from "./../../utils/encryption/decrypt.js";
import otpSchema from "./../schemas/otp.schema.js";
import { userRoles, providers, genders, otpExpiry } from "./../../utils/data.js";
import hash from "./../../utils/hash/hash.js";
import encrypt from "./../../utils/encryption/encrypt.js";



const schema = new mongoose.Schema ({

  firstName: {
    type: String,
    required: [ true, "first name is required." ],
    trim: true,
    minLength: [ 3, "first name must be at least 3 characters." ],
    maxLength: [ 25, "first name must be at most 25 characters." ]
  },
  lastName: {
    type: String,
    required: [ true, "last name is required." ],
    trim: true,
    minLength: [ 3, "last name must be at least 3 characters." ],
    maxLength: [ 25, "last name must be at most 25 characters." ]
  },

  email: {
    type: String,
    required: [ true, "email is required." ],
    trim: true,
    lowercase: true,
    isEmail: [ true, "email is invalid." ],
    unique: [ true, "email is already in use." ]
  },
  confirmed: Boolean, // isConfirmed

  password: String,

  gender: {
    type: String,
    enum: {
      values: Object.values (genders),
      message: `role must be ${Object.values (genders).join (", ")}.`
    },
    default: genders.male
  },

  provider: {
    type: String,
    enum: Object.values (providers),
    default: providers.system
  },

  DOB: {
    type: Date,
    required: [ true, "date of birth is required." ],
    max: [ new Date (Date.now () - 1000 * 60 * 60 * 24 * 365 * 18), "you must be at least 18 years old." ]
  },
  mobileNumber: String,

  role: {
    type: String,
    enum: {
      values: Object.values (userRoles),
      message: `role must be ${Object.values (userRoles).join (", ")}.`
    },
    default: userRoles.user
  },

  deletedAt: Date,
  bannedAt: Date,
  updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  iat: Date, // changeCredentialTime

  profilePic: fileSchema,
  coverPic: fileSchema,

  OTP: [otpSchema]

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


function userize (user) {
  user.mobileNumber = decrypt (user.mobileNumber);
  if (!user.profilePic)
    user.profilePic = {
      secure_url: 'https://res.cloudinary.com/dncyaw5ii/image/upload/v1740957121/defaultProfilePicture.jpg',
      public_id: 'defaultProfilePicture'
    };
  if (!user.coverPic)
    user.coverPic = {
      secure_url: 'https://res.cloudinary.com/dncyaw5ii/image/upload/v1740957127/defaultCoverPicture.png',
      public_id: 'defaultCoverPicture'
    };
};
schema.post (["find", "findOne", "findById"], async function (data) {
  if (!data) return;
  if (Array.isArray (data)) data.forEach ((user) => userize (user));
  else {userize (data)};
});



schema.virtual ("username").get ( function () { return `${this.firstName} ${this.lastName}` } );


schema.methods.createOTP = async function (type) {
  const otp = genOTP ();
  this.OTP.push ({ code: hash (otp), type });
  await this.save ();
  return otp;
};


schema.methods.softDelete = async function () {
  
  // delete the user
  this.deletedAt = Date.now ();
  await this.save ();

  // delete anything related to the user deleted.

};


schema.pre ("save", function (next) {
  if (this.profilePic.public_id == "defaultProfilePicture") 
    this.profilePic = undefined;
  if (this.coverPic.public_id == "defaultCoverPicture")
    this.coverPic = undefined;
  if (this.isModified ("password")) this.password = hash ( this.password );
  if (this.isModified("mobileNumber")) this.mobileNumber = encrypt (this.mobileNumber);
  next ();
});



const model = mongoose.model ("User", schema);
export default model;
