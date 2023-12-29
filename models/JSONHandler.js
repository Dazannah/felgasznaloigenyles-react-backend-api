const { writeFile, readFile } = require('fs')
const dotenv = require("dotenv")
dotenv.config()

const Mailer = require("./Mailer")

class JSONHandler{
    path = './mails.json'

    constructor(){
        this.mailer = new Mailer(process.env.EMAILUSER,
            process.env.EMAILPASSWORD,
            process.env.SMTP,
            process.env.SMTPPORT,
            true,
            process.env.EMALTOSEND)
    }

    async write(dataToWrite){
        writeFile(this.path, JSON.stringify(dataToWrite, null, 2), (error) => {
          if (error) {
            console.log('An error has occurred ', error);
            return;
          }
          console.log('Data written successfully to disk');
        });
    }

    async read(whatToDo){
        return readFile(this.path, (error, data) => {
            if (error) {
                console.log(error)
              if(error.code === "ENOENT"){
                whatToDo([])
              }
              return 
            }

            const json = JSON.parse(data);
            whatToDo(json)
        });
    }

    async sendEmailIfAny(){
        await this.read(async json =>{
            if(json.length > 0){
                const {subject, palinText, htmlText} = this.mailer.parseEmail(json)
                this.mailer.sendMail(subject,palinText,htmlText,process.env.EMALTOSEND)
                //await this.write([])
            }
        })
    }

    async addEmail(email){
        return await this.read(async json =>{
            json.push(email)
            await this.write(json)
        })
    }
}

module.exports = JSONHandler