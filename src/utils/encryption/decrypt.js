
import cryptojs from "crypto-js";
import { encryptionSecret } from "./../data.js";


const decrypt = ( text ) => cryptojs.AES.decrypt (text, encryptionSecret).toString (cryptojs.enc.Utf8);
export default decrypt;
