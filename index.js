
import { port } from "./src/utils/data.js";
import bootstrap from "./src/app.controller.js";
import express from "express";
import log from "./src/utils/log/logger.js";


const app = express ();

await bootstrap ( app, express );

app.listen ( port, () => log (`http://localhost:${port}/`) );
