
import nodemailer from "nodemailer";
import { email } from "./../data.js";
import { EventEmitter } from "events";



const transport = nodemailer.createTransport ({

  service: "gmail",

  port: 465,
  secure: true,

  auth: {
    user: email.address,
    pass: email.password
  },

  debug: true,
  logger: true

});

const mail = (options = { from: String, to: String, subject: String, text: String, html: String }) => transport.sendMail (options);



const mailer = new EventEmitter ();
mailer.on ("mail", mail);


export default mailer;
