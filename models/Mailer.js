const nodemailer = require("nodemailer")

class Mailer{
    constructor(emailUser, emailPassword, smtp, port, isItSecure, defaultDestination = ""){
        this.emailUser = emailUser
        this.defaultDestination = defaultDestination

        this.transporter = nodemailer.createTransport({
            host: smtp,
            port: port,
            secure: isItSecure,
            auth: {
              user: emailUser,
              pass: emailPassword,
            },
          });
    }

    async sendMail(subject, plainText, htmlText, destination = this.defaultDestination){
        const result = await this.transporter.sendMail({
            from: this.emailUser, // sender address
            to: destination,//"bar@example.com, baz@example.com",  list of receivers
            subject, // Subject line
            text: plainText, // plain text body
            html: htmlText, // html body
          })

          return result
    }
}

module.exports = Mailer