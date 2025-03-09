
import chalk from "chalk";
import { colors } from "./../data.js";


const logger = ( message, fg = colors.fg.auto, bg = colors.bg.auto ) => console.log ( chalk[fg][bg] ( message ) );
export default logger;
