
import { email } from "./../data.js";


function generate (from, to, options = {otp: String}) {

  const mail = {};

  if ( from == "confirm" ) {
    mail.from = `Confirm Email <${email.address}>`;
    mail.to = to;
    mail.subject = `Confirm Email on MWD32`;
    mail.text = `confirm you email on MWD32 app using the following otp code: ${options.otp}`;
  } else if ( from == "change" ) {
    mail.from = `Change Email <${email.address}>`;
    mail.to = to;
    mail.subject = `Change Email on MWD32`;
    mail.text = `Change you email on MWD32 app using the following otp code: ${options.otp}`;
  } else if( from == "forget" ) {
    mail.from = `Reset Password <${email.address}>`;
    mail.to = to;
    mail.subject = `Reset Password on MWD32`;
    mail.text = `Reset Your Password on MWD32 app using the following otp code: ${options.otp}`;
  } else return undefined;

  return mail;

};


export default generate;
