const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testingapp325@gmail.com', //process.env.EMAIL_USER,
    pass: 'A1234567890B' //process.env.EMAIL_PASS
  }
})

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  let mailOptions = {
    from: 'Mini Bank Express',
    to: email,
    subject: "Please Confirm Your Mini Bank Account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for registering with Mini Bank. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:4500/user/auth/confirm/${confirmationCode}> Click here</a>
          </div>`,
 };  

  transporter
    .sendMail(
      mailOptions
    )

    return true;
};



