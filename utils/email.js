const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter
  /* 
  Using mail services 
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate the less secure app option in gmail
  });
  */

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //define the email options
  const mailOptions = {
    from: 'David Adewale <hello@david.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //actually send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
