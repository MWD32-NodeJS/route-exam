
import connect from "./db/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import adminGraphQL from "./modules/admin/admin.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import chatRouter from "./modules/chat/chat.controller.js";
import jopRouter from "./modules/jop/jop.controller.js";
import responseHandler from "./middlewares/response.handler.middleware.js";
import notFoundRequest from "./modules/404.js";
import applicationRouter from "./modules/application/application.controller.js";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authentication from "./middlewares/authentication.middleware.js";



async function bootstrap ( app, express ) {

  await connect ();

  app.use ( express.json () );
  app.use ( cors () );

  app.use ( "/auth", authRouter );
  app.use ( "/user", userRouter );
  app.use ( "/company", companyRouter );
  app.use ( "/chat", chatRouter );
  app.use ( "/jop", jopRouter );
  app.use ( "/application", applicationRouter );
  app.use ( "/admin", adminGraphQL)

  console.table ( listEndpoints ( app ) );
  app.all ("*", notFoundRequest);

  app.use ( responseHandler );

};

export default bootstrap;
