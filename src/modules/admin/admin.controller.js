
import { GraphQLSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { query, mutation } from "./admin.services.js";



const schema = new GraphQLSchema ({ query, mutation });



export default createHandler ({ schema });
