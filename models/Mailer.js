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

    parseEmail(json){
      const subject = `Jogosultság igénylő ${json.length} új esemény`
      let plainText = ""
      let htmlText = ""

      json.forEach(email => {
        plainText += `Név: ${email.name} Folyamat: ${email.process} Osztály: ${email.class} Kérelmező: ${email.requestedBy}
        `
        htmlText += `Név: ${email.name} Folyamat: ${email.process} Osztály: ${email.class} Kérelmező: ${email.requestedBy}<br>`
      })

      return {subject, plainText, htmlText}
    }
}

module.exports = Mailer