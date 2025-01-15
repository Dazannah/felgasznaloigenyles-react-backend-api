const dotenv = require("dotenv")
dotenv.config() //dotenv enviroment variable, a .env fileba mentjük le a mongodb connection stringet, ami a CONNECTIONSTRING ben tároltunk le
const { MongoClient } = require("mongodb")
const JSONHandler = require("./models/JSONHandler")
const Mailer = require("./models/Mailer")

const mailer = new Mailer(process.env.EMAILUSER,
  process.env.EMAILPASSWORD,
  process.env.SMTP,
  process.env.SMTPPORT,
  true,
  process.env.EMAILTO)

const client = new MongoClient(process.env.CONNECTIONSTRING)
const jsonHandler = new JSONHandler(mailer)

let db

async function start() {
  client.connect()
  db = client.db("jogosultsagigenylo")
  module.exports = client
  const app = require("./index")
  watchMailsJson()
  sendDailyReport()
  app.listen(process.env.PORT) //enviroment variable PORT-ban a 3000
}
start()

function watchMailsJson(){
  setTimeout(async ()=>{
    jsonHandler.sendEmailIfAny()
    watchMailsJson()
  }, 1000 * 60 * 5)
}

function sendDailyReport(){
  const { GetRequestsData } = require("./models/Database")

  const now = new Date(Date.now());
  const millisTillTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0, 0, 0) - now; // 14:00

  setTimeout(async ()=>{
    const forAllowTickets = await GetRequestsData.prototype.getAllRequestForPermission()
    const forAllow = forAllowTickets.length
    
    const data = {
      forAllow
    }

    const {subject, plainText, htmlText} = mailer.parseDailyReportEmail(data)
    await mailer.sendMail(subject, plainText, htmlText, process.env.DAILYREPORTTO)
    sendDailyReport()

  }, millisTillTime)
}

module.exports = db
