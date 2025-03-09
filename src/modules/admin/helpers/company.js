
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } from "graphql";
import USER from "./user.js";


const companyType = new GraphQLObjectType ({
  name: "COMPANY",
  fields: {
    owner: { type: new GraphQLNonNull (GraphQLID) },
    email: { type: new GraphQLNonNull (GraphQLString) },
    address: { type: new GraphQLNonNull (GraphQLString) },
    
    name: { type: new GraphQLNonNull (GraphQLString) },
    industry: { type: new GraphQLNonNull (GraphQLString) },
    description: { type: new GraphQLNonNull (GraphQLString) },
    
    HRs: { type: new GraphQLNonNull(new GraphQLList (USER)) },
    employeesRange: { type: new GraphQLNonNull (GraphQLInt) },
    
    logo: { type: new GraphQLNonNull (GraphQLString) },
    coverPic: { type: new GraphQLNonNull (GraphQLString) },
    legalAttachment: { type: new GraphQLNonNull (GraphQLString) },
   
    approved: { type: new GraphQLNonNull (GraphQLBoolean) },
    bannedAt: { type: new GraphQLNonNull (GraphQLString) },
    deletedAt: { type: new GraphQLNonNull (GraphQLString) },
    _id: { type: new GraphQLNonNull (GraphQLID) },
  }
});

export default companyType;
