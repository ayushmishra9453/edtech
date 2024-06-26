const nodemailer=require('nodemailer');

const sendMail= async(email, title, body)=>{
   try{
    let transporter= nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
          user:process.env.MAIL_USER,
          pass:process.env.PASS
        }
    })

    let info= await transporter.sendMail({
        from:"StudyNotion -> by Ayush",
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`
    })

    console.log(info);
   }
   catch(error){
    console.log(error);
   }
}

module.exports=mailSender;
