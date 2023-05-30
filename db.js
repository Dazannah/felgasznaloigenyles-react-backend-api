const dotenv = require('dotenv')
dotenv.config() //dotenv enviroment variable, a .env fileba mentjük le a mongodb connection stringet, ami a CONNECTIONSTRING ben tároltunk le
const {MongoClient} = require("mongodb")

const client = new MongoClient(process.env.CONNECTIONSTRING)
let db

async function start(){
    client.connect()
    db = client.db
    module.exports = client
    const app = require('./index')
    app.listen(process.env.PORT) //enviroment variable PORT-ban a 3000
}
start()

module.exports = db