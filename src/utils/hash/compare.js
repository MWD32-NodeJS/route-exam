
import { compareSync } from "bcrypt";


const compare = ( plain, hash ) => compareSync ( plain, hash );
export default compare;
