const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body, attachments) => {
    try {
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        })

        let info = await transporter.sendMail({
            from: `"IMS" <${process.env.MAIL_USER}>`, 
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
            attachments: attachments,
        })

        // console.log(info.response);
        return info;
    } catch (error) {
        console.error('error occured while creating mail transport: ', error);
        console.error(error.message);
    }
}

module.exports = mailSender