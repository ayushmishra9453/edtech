const nodemailer = require("nodemailer");

// const mailSender = async (email, title, body) => {
//     try{
//             let transporter = nodemailer.createTransport({
//                 host:process.env.MAIL_HOST,
//                 port: process.env.SMPT_PORT,
//                 service: process.env.SMPT_SERVICE,
//                 auth:{
//                     user: process.env.MAIL_USER,
//                     pass: process.env.MAIL_PASS,
//                 }
//             })


//             let info = await transporter.sendMail({
//                 from: 'StudyNotion || CodeHelp - by Babbar',
//                 to:`${email}`,
//                 subject: `${title}`,
//                 html: `${body}`,
//             })
//             console.log(info);
//             return info;
//     }
//     catch(error) {
//         console.log(error.message);
//     }
// }


// module.exports = mailSender;

const mailSender = async (email, title, body) => {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
  
      let info = await transporter.sendMail({
        from: 'StudyNotion || CodeHelp - by Babbar',
        to: `${email}`,
        subject: `${title}`,
        html: `${body}`,
      });
  
      return { response: info.response };
    } catch (error) {
      console.log(error.message);
      return { error: error.message };
    }
  };
  module.exports=mailSender;