const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const usersDB = require("../db").db("jogosultsagigenylo").collection("users")
const deletedUsersDB = require("../db").db("jogosultsagigenylo").collection("deletedUsers")
const ObjectID = require("mongodb").ObjectId
const Ticket = require("./Ticket")

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
    //itt nem lép bele a szaros modellbe valamiért
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

    return response
  } catch (err) {
    return err
  }
}

Users.prototype.deleteUser = async function () {
  try {
    const userData = await usersDB.findOne({ _id: this.id })
    userData.status = "deleted"

    const deletedUserInsertResult = await deletedUsersDB.insertOne(userData)
    if (deletedUserInsertResult.acknowledged) {
      const deleteUserResult = await usersDB.deleteOne({ _id: userData._id })
      console.log(deleteUserResult)
      return deleteUserResult
    }
    return deletedUserInsertResult
  } catch (err) {
    return err
  }
}

module.exports = Users
