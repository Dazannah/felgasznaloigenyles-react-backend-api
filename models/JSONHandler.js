const { writeFile, readFile } = require('fs')
const dotenv = require("dotenv")
dotenv.config()
const processes = process.env.PROCESSES.split(",")

const Mailer = require("./Mailer")

class JSONHandler{

    constructor(){
        this.mailer = new Mailer(process.env.EMAILUSER,
            process.env.EMAILPASSWORD,
            process.env.SMTP,
            process.env.SMTPPORT,
            true,
            process.env.EMAILTO)
    }


    async write(path, dataToWrite){
        return writeFile(path, JSON.stringify(dataToWrite, { flag: 'wx' }, 2), (error) => {
          if (error) {
            console.log('An error has occurred ', error);
            return;
          }
          console.log('Data written successfully to disk');
        });
    }

    async read(path, whatToDo){
        return readFile(path, async (error, data) => {
            if (error) {
                console.log(error)
              if(error.code === "ENOENT"){
                if(error.errno === -4058) {
                    await this.write(path, [])
                }
                //whatToDo([])
              }
              return
            }
            
            try{
                const json = JSON.parse(data);
                whatToDo(json)
            }catch(err){
                console.log("JSON read error: " + err)
            }

        });
    }

    async sendEmailIfAny(){
        for(const process of processes){
            const processPath = `./json/${process.normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(" ","").toLowerCase()}.json`
            await this.sendEmail(processPath, process)
        }
    }

    async sendEmail(path, process){
        await this.read(path ,async json =>{
            if(json.length > 0){
                const {subject, palinText, htmlText} = this.mailer.parseEmail(json, process)
                await this.mailer.sendMail(subject,palinText,htmlText)
                await this.write(path, [])
            }
        })
    }

    async addEmail(path, email){
        return await this.read(path, async json =>{
            json.push(email)
            await this.write(path, json)
        })
    }
}

module.exports = JSONHandler