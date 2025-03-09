
import userModel from "./../../db/models/user.model.js";
import companyModel from "./../../db/models/company.model.js";
import USER from "./helpers/user.js";
import COMPANY from "./helpers/company.js";
import { userAuthorities } from "./../../utils/data.js";
import authenticate from "./helpers/authenticate.js";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";
import * as adminValidation from "./admin.validation.js";
import validate from "./helpers/validate.js";




async function getDataResolve (_, { Authorization }) {
  const message = validate ({ Authorization }, adminValidation.getDataValidation);
  if (message) return { sucess: 0, status: 400, message };

  const auth = await authenticate (Authorization);
  console.log ("auth:", auth);
  if (auth.status) return auth;
  
  const users = await userModel.find ({}).select ("-OTP -iat");

  const companies = await companyModel.find ({});

  return {
    success: 1,
    status: 200,
    message: "data is got successfully.",
    companies,
    users: users.map ((user) => {
      return {
        username: user.username,
        firstName: user.firstName, lastName: user.lastName,
        email: user.email, confirmed: user.confirmed,
        mobileNumber: user.mobileNumber,
        role: user.role, provider: user.provider,
        bannedAt: user.bannedAt, deletedAt: user.deletedAt,
        updatedBy: user.updatedBy,
        deletedBy: user.deletedBy,
        DOB: user.DOB, gender: user.gender,
        profilePic: user.profilePic.secure_url,
        coverPic: user.coverPic.secure_url,
        _id: user._id,
      }
    })
  };
};
const getDataType = new GraphQLObjectType ({
  name: "getDataType",
  fields: {
    success: { type: new GraphQLNonNull (GraphQLInt) },
    status: { type: new GraphQLNonNull (GraphQLInt) },
    message: { type: new GraphQLNonNull (GraphQLString) },
    users: { type: new GraphQLList (USER) },
    companies: { type: new GraphQLList (COMPANY) },
  }
});
const getDataArgs = {
  Authorization: { type: new GraphQLNonNull (GraphQLString) },
};


async function usersBannerResolve (_, { Authorization, userId }) {
  const message = validate ({ Authorization, userId }, adminValidation.usersBannerValidation);
  if (message) return { success: 0, status: 400, message };

  const auth = await authenticate (Authorization);
  if (auth.status) return auth;

  const user = await userModel.findById (userId);
  if (!user)
    return { success: 0, status: 404, message: "user not found." }
  else if (user.deletedAt)
    return { success: 0, status: 404, message: "user is deleted before." }
  else if (userAuthorities[user.role] > userAuthorities[auth.role])
    return { success: 0, status: 401, message: "بس يا بابا ؟!" }
  else if (user.bannedAt) {
    user.bannedAt = undefined;
    user.updatedBy = auth._id;
    await user.save ();
    return { success: 0, status: 404, message: "user unbanned successfully." };
  }

  user.bannedAt = Date.now ();
  user.updatedBy = auth._id;
  await user.save ();
  return { success: 1, status: 200, message: "user banned successfully." }
};
const usersBannerType = new GraphQLObjectType ({
  name: "usersBannerType",
  fields: {
    success: { type: new GraphQLNonNull (GraphQLInt) },
    status: { type: new GraphQLNonNull (GraphQLInt) },
    message: { type: new GraphQLNonNull (GraphQLString) }
  }
});
const usersBannerArgs = {
  Authorization: { type: new GraphQLNonNull (GraphQLString) },
  userId: { type: new GraphQLNonNull (GraphQLString) }
};




async function companiesBannerResolve (_, { Authorization, companyId }) {
  const message = validate ({ Authorization, companyId }, adminValidation.companiesBannerValidation);
  if (message) return { success: 0, status: 400, message };

  const auth = await authenticate (Authorization);
  if (auth.status) return auth;

  const company = await companyModel.findById (companyId);
  if (!company)
    return { success: 0, status: 404, message: "company not found." }
  else if (company.deletedAt)
    return { success: 0, status: 404, message: "company is deleted." }
  else if (company.bannedAt) {
    company.bannedAt = undefined;
    company.updatedBy = auth._id;
    await company.save ();
    return { success: 0, status: 404, message: "company unbanned successfully." };
  }

  company.bannedAt = Date.now ();
  company.updatedBy = auth._id;
  await company.save ();
  return { success: 1, status: 200, message: "company banned successfully." }
};
const companiesBannerType = new GraphQLObjectType ({
  name: "companiesBannerType",
  fields: {
    success: { type: new GraphQLNonNull (GraphQLInt) },
    status: { type: new GraphQLNonNull (GraphQLInt) },
    message: { type: new GraphQLNonNull (GraphQLString) }
  }
});
const companiesBannerArgs = {
  Authorization: { type: new GraphQLNonNull (GraphQLString) },
  companyId: { type: new GraphQLNonNull (GraphQLString) }
}


async function companiesApproverResolve (_, { Authorization, companyId }) {
  const message = validate ({ Authorization, companyId }, adminValidation.companiesApproverValidation);
  if (message) return { sucess: 0, status: 400, message };

  const auth = await authenticate (Authorization);
  if (auth.status) return auth;

  const company = await companyModel.findById (companyId);
  if (!company)
    return { success: 0, status: 404, message: "company not found." }
  else if (company.deletedAt)
    return { success: 0, status: 404, message: "company is deleted." }
  else if (company.bannedAt)
    return { success: 0, status: 404, message: "company is banned." };
  else if (company.approved)
    return { success: 0, status: 404, message: "company is already approved." };

  company.approved = true;
  await company.save ();
  return { success: 1, status: 200, message: "company approved successfully." }

};
const companiesApproverType =new GraphQLObjectType ({
  name: "companiesApproverType",
  fields: {
    success: { type: new GraphQLNonNull (GraphQLInt) },
    status: { type: new GraphQLNonNull (GraphQLInt) },
    message: { type: new GraphQLNonNull (GraphQLString) }
  }
});
const companiesApproverArgs = {
  Authorization: { type: new GraphQLNonNull (GraphQLString) },
  companyId: { type: new GraphQLNonNull (GraphQLString) }
}



export const query = new GraphQLObjectType ({
  name: "adminQuery",
  fields: {
    getData: {
      type: getDataType,
      args: getDataArgs,
      resolve: getDataResolve
    }
  }
});

export const mutation = new GraphQLObjectType ({
  name: "mutationQuery",
  fields: {
    usersBanner: {
      type: usersBannerType,
      args: usersBannerArgs,
      resolve: usersBannerResolve
    },
    companiesBanner: {
      type: companiesBannerType,
      args: companiesBannerArgs,
      resolve: companiesBannerResolve
    },
    companiesApprover: {
      type: companiesApproverType,
      args: companiesApproverArgs,
      resolve: companiesApproverResolve
    },
  }
});
