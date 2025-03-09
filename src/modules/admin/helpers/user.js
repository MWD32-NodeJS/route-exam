
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";


const userType = new GraphQLObjectType ({
  name: "USER",
  fields: {
    profilePic: { type: new GraphQLNonNull (GraphQLString) },
    coverPic: { type: new GraphQLNonNull (GraphQLString) },

    username: { type: new GraphQLNonNull (GraphQLString) },
    firstName: { type: new GraphQLNonNull (GraphQLString) },
    lastName: { type: new GraphQLNonNull (GraphQLString) },
    
    email: { type: new GraphQLNonNull (GraphQLString) },
    confirmed: { type: GraphQLBoolean },
    mobileNumber: { type: new GraphQLNonNull (GraphQLString) },
    
    gender: { type: new GraphQLNonNull (GraphQLString) },
    DOB: { type: new GraphQLNonNull (GraphQLString) },
    
    provider: { type: new GraphQLNonNull (GraphQLString) },
    role: { type: new GraphQLNonNull (GraphQLString) },
    
    bannedAt: { type: new GraphQLNonNull (GraphQLString) },
    deletedAt: { type: new GraphQLNonNull (GraphQLString) },
    updatedBy: { type: new GraphQLNonNull (GraphQLID) },
    
    _id: { type: new GraphQLNonNull (GraphQLID) },
  }
});

export default userType;
