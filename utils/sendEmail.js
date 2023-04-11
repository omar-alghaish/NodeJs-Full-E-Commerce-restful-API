const nodeMailer = require("nodemailer");
const sendEmail = async(options) =>{
  // 1) Create transporter (service that will send email like "gamil","mailgun","sendGrid")
  let transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT, // if secure false port = 587, if true port=465
    secure: true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
  })
  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from:"E-shop App ",
    to:options.email,
    subject: options.subject,
    text: options.message
  }
  // 3) Send email
await transporter.sendMail(mailOpts)

};


module.exports = sendEmail;