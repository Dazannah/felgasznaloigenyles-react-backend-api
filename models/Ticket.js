const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")

let Ticket = function (data, type) {
  if (type == "Új felhasználó") {
    this.data = data.dataToSend
    this.data.ticketCreation = {
      userName: data.decodedToken.data.username,
      createTime: require("../utils.js").getCurrentTime()
    }
  }
  this.data.process = type
  this.errors = []
}

Ticket.prototype.validate = function () {
  try {
    if (!this.data.personalInformations.name) this.errors.push("Név megadása kötelező.")
    if (!this.data.personalInformations.classId) this.errors.push("Osztály megadása kötelező.")
    if (!this.data.personalInformations.classLeader) this.errors.push("Osztályvezető megadása kötelező.")
    if (!this.data.personalInformations.workPost) this.errors.push("Beosztás megadása kötelező.")
    if (!this.data.personalInformations.workLocation) this.errors.push("Munkavégzés hely megadása kötelező.")

    if (this.errors.length != 0) return this.errors
  } catch (e) {
    this.errors.push(JSON.stringify(e))
    return this.errors
  }
}

Ticket.prototype.createNewUserTicket = async function () {
  try {
    const result = await requestsDB.insertOne(this.data)
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
