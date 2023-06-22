const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const usersDB = require("../db").db("jogosultsagigenylo").collection("users")
const ObjectID = require("mongodb").ObjectId
const Ticket = require("../models/Ticket")

const Users = function (data, type, token) {
  this.id = data
  this.token = token
  this.errors = []
}

Users.prototype.getAllUser = async function () {
  try {
    const users = await usersDB.find().sort({ "personalInformations.name": -1 }).toArray()
    return users
  } catch (err) {
    return err
  }
}

Users.prototype.getSingleUser = async function () {
  try {
    const user = await usersDB.findOne({
      _id: new ObjectID(this.id)
    })
    return user
  } catch (err) {
    return err
  }
}

Users.prototype.searchForDeletRequest = async function () {
  try {
    const ticket = new Ticket({ userId: this.id }, "searchDeleteInProgress")
    const deleteInProgress = await ticket.findDeletedRequestInProgress()
    return deleteInProgress
  } catch (err) {
    return err
  }
}

Users.prototype.createUserDelete = async function () {
  try {
    const user = await usersDB.findOne({
      _id: new ObjectID(this.id)
    })
    const ticket = new Ticket({ user: user, decodedToken: this.token }, "Felhasználó törlése")
    const response = await ticket.createDeleteTicket()
    return response
  } catch (err) {
    return err
  }
}

module.exports = Users
