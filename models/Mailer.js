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

    parseEmail(json, process){
      const subject = `[${process}] ${json.length}db` // [ÚJ ÍGÉNY] emaila.length db , 5db Engedélyezett/Elkészült ígény külön e-mailban
      let plainText = ""

      let htmlText = `<table style="border: 1px solid black;">
                        <tr>
                          <th style="border: 1px solid black;">Név</th>
                          <th style="border: 1px solid black;">Folyamat</th>
                          <th style="border: 1px solid black;">Osztály</th>
                          <th style="border: 1px solid black;">Kérelmező</th>
 
                        `
      if(process === "ELKÉSZÜLT") htmlText += '<th style="border: 1px solid black;">Lezárta</th>'
      htmlText += "</tr>"

      json.forEach(email => {
        plainText += `Név: ${email.name} Folyamat: ${email.process} Osztály: ${email.class} Kérelmező: ${email.requestedBy}`
        if(process === "ELKÉSZÜLT") {
          plainText += `Lezárta: ${email.closedBy}
          `
        }else{
          plainText += `
          `
        }

        htmlText += `<tr><td style="border: 1px solid black;">${email.name}</td>
        <td style="border: 1px solid black;">${email.process}</td>
        <td style="border: 1px solid black;">${email.class}</td>
        <td style="border: 1px solid black;">${email.requestedBy}</td>`

        if(process === "ELKÉSZÜLT") htmlText += `<td style="border: 1px solid black;">${email.closedBy}</td>`

        htmlText += "</tr>"

      })
      htmlText += "</table>"

      return {subject, plainText, htmlText}
    }

    parseDailyReportEmail(data){
      const subject = `Jóváhagyandó tételek emlékeztető`
      const plainText = `Tisztelt Cím! 
Az Jogosultság igénylő rendszerben önnek ${data.forAllow} darab jóváhagyásra váró tétele van. 
A rendszert a következő webcímen tudja elérni: 
http://jogosultsagigenylo.csmek.local/
`
      const htmlText = `Tisztelt Cím!<br>
Az Jogosultság igénylő rendszerben önnek <b>${data.forAllow}</b> darab jóváhagyásra váró tétele van.<br>
A rendszert a következő webcímen tudja elérni:<br>
http://jogosultsagigenylo.csmek.local/
`

      
      return {subject, plainText, htmlText}
    }
}

module.exports = Mailer