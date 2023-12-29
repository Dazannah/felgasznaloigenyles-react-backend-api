const dotenv = require("dotenv")
dotenv.config() //dotenv enviroment variable, a .env fileba mentjük le a mongodb connection stringet, ami a CONNECTIONSTRING ben tároltunk le
const { MongoClient } = require("mongodb")
const JSONHandler = require("./models/JSONHandler")

const client = new MongoClient(process.env.CONNECTIONSTRING)
const jsonHandler = new JSONHandler()

let db

async function start() {
  client.connect()
  db = client.db("jogosultsagigenylo")
  module.exports = client
  const app = require("./index")
  startWatchMailsJson()
  app.listen(process.env.PORT) //enviroment variable PORT-ban a 3000
}
start()

function startWatchMailsJson(){
  setTimeout(async ()=>{
    jsonHandler.sendEmailIfAny()
    startWatchMailsJson()
}, 2000)
}

module.exports = db
