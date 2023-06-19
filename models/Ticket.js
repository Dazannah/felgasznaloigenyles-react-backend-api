const { response } = require("express")

const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const usersDB = require("../db").db("jogosultsagigenylo").collection("users")
const ObjectID = require("mongodb").ObjectId

let Ticket = function (data, type) {
  if (type == "Új felhasználó") {
    this.data = data.dataToSend
    this.data.ticketCreation = {
      userName: data.decodedToken.data.username,
      createTime: require("../utils.js").getCurrentTime()
    }
  }
  if (type == "updatePermission") {
    this.data = data.dataToSend
    this.data.userNames = data.dataToSend.userNames
    this.data.authorizedBy = {
      userName: data.decodedToken.data.username,
      time: require("../utils.js").getCurrentTime()
    }
  }
  if (type == "closeNewUserTicket") {
    this.data = data.dataToSend
    this.data.createdBy = {
      userName: data.decodedToken.data.username,
      time: require("../utils.js").getCurrentTime()
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

Ticket.prototype.getAllForPermission = async function () {
  try {
    const response = await requestsDB
      .find({
        "permission.allowed": { $nin: ["Elutasított", "Engedélyezett"] }
      })
      .toArray()
    return response
  } catch (err) {
    return err
  }
}

Ticket.prototype.updatePermission = async function () {
  try {
    const response = await requestsDB.findOneAndUpdate(
      {
        _id: new ObjectID(this.data.ticketId)
      },
      {
        $set: {
          userNames: this.data.userNames,
          permission: {
            allowed: this.data.permission,
            permissionNote: this.data.notes,
            permissionTime: this.data.authorizedBy.time,
            authorizedBy: this.data.authorizedBy.userName
          }
        }
      }
    )
    return response
  } catch (err) {
    return err
  }
}

Ticket.prototype.getAllowedTickets = async function () {
  try {
    const response = await requestsDB
      .find({
        "permission.allowed": "Engedélyezett",
        isCompleted: { $nin: [true] }
      })
      .toArray()
    return response
  } catch (err) {
    return err
  }
}

Ticket.prototype.closeNewUserTicket = async function () {
  try {
    const response = await requestsDB.findOneAndUpdate(
      {
        _id: new ObjectID(this.data.ticketId)
      },
      {
        $set: {
          completed: this.data.createdBy,
          isCompleted: true,
          userId: new ObjectID(this.createdUser.insertedId)
        }
      }
    )
    return "ok"
  } catch (err) {
    return err
  }
}

Ticket.prototype.createUser = async function () {
  try {
    const ticketData = await requestsDB.findOne({
      _id: new ObjectID(this.data.ticketId)
    })
    const userData = {
      personalInformations: ticketData.personalInformations,
      userPermissionsLeft: ticketData.userPermissionsLeft,
      userPermissionsMiddle: ticketData.userPermissionsMiddle,
      userPermissionsRight: ticketData.userPermissionsRight,
      technical: ticketData.technical
    }
    try {
      this.createdUser = await usersDB.insertOne(userData)
      return "ok"
    } catch (err) {
      return err
    }
  } catch (err) {
    return err
  }
}

Ticket.prototype.getCompletedTickets = async function () {
  try {
    const response = await requestsDB
      .find({
        isCompleted: true
      })
      .toArray()
    return response
  } catch (err) {
    return err
  }
}

module.exports = Ticket
