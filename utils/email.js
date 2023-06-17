const nodemailer = require('nodemailer');

//Prepare the Email sending service
//Set options to email then send email
const sendEmail = async (options) => {
  const transportor = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'd7af950767716a',
      pass: 'd0ed433a18d07f',
    },
  });
  const emailOptions = {
    from: 'Muhib arshad <muhibarshad123@gmail.com>',
    to: options.to,
    subject: options.subject,
    text: options.message,
    // html
  };
  await transportor.sendMail(emailOptions);
};

module.exports = sendEmail;
