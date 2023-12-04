// to send email form server first you have to =>
//use 2-step verification and generate app password
//insted of using your password use app password of gmail
//for this go to the => manage your account => security setting and=>enable 2-step verifiction =>crete app pssword (select other option)
import nodemailer from "nodemailer";
import { email, password } from "../constant.js";

let transporterInfo = {
  // host: emailHost,
  host: "smtp.gmail.com",
  // if from is gmail use gmail smtp
  port: 587,
  secure: false,
  //   auth user and pass play the role from
  auth: {
    // note user and pass most be genuine
    //it is the email through which email is send
    user: email,
    pass: password,
    //insted of using your password use app password of google
    //for this go to the => manage your account => security setting and=>enable 2-step verifiction =>crete app pssword (select other option)
  },
};

export let sendMail = async (mailInfo) => {
  try {
    let transporter = nodemailer.createTransport(transporterInfo); //transporter gives from information
    let info = await transporter.sendMail(mailInfo);
  } catch (error) {
    console.log("error has occurred", error.message);
  }
};
