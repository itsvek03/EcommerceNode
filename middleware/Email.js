// Importing the library
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //create an email
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "ded54235d51cc6",
      pass: "e8c7fe8bde7dfa", // generated ethereal password
    },
  });

  // send the email
  const sendEmail = {
    from: "Vivek Maurya <faq03031999@gmail.com>",
    to: options.Email,
    subject: options.subject,
    html: `You are requested for password reset
      Click <a href="http://localhost:3000/resetPassword/${options.message}">here</a> to reset the password`,
    //text: options.message, // plain text body
  };

  await transport.sendMail(sendEmail);
};
module.exports = sendEmail;
