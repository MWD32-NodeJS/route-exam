
import cryptojs from "crypto-js";
import { encryptionSecret } from "./../data.js";


const encrypt = ( text ) => cryptojs.AES.encrypt (text, encryptionSecret).toString ();
export default encrypt;
