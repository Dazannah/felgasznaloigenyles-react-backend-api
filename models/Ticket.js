const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")

let Ticket = function (data) {
  this.data = data
  this.errors = [""]
}

Ticket.prototype.createNewUserTicket = async function () {
  console.log(this.data)
  try {
    //const result = await requestsDB.insertOne(this.data)
    return result
  } catch (err) {
    return err
  }
}

Ticket.prototype.findAll = async function () {
  try {
    const response = await requestsDB.find().toArray()
    return response
  } catch (err) {
    return err
  }
}

module.exports = Ticket
