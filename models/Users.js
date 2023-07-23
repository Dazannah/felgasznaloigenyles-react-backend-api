const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const usersDB = require("../db").db("jogosultsagigenylo").collection("users")
const deletedUsersDB = require("../db").db("jogosultsagigenylo").collection("deletedUsers")
const ObjectID = require("mongodb").ObjectId
const Ticket = require("./Ticket")

class Users {
  constructor(data, type, token) {
    this.id = data
    this.token = token
    this.errors = []
  }

  async getAllUser() {
    try {
      const users = await usersDB.find().collation({ locale: "hu" }).sort({ "personalInformations.name": 1 }).toArray()
      return users
    } catch (err) {
      return err
    }
  }

  async getAllDeletedUser() {
    try {
      const users = await deletedUsersDB.find().collation({ locale: "hu" }).sort({ "personalInformations.name": 1 }).toArray()
      return users
    } catch (err) {
      return err
    }
  }

  async getSingleUser() {
    try {
      const user = await usersDB.findOne({
        _id: new ObjectID(this.id)
      })
      return user
    } catch (err) {
      return err
    }
  }

  async searchForDeletRequest() {
    try {
      const deleteInProgress = await Ticket.prototype.findDeletedRequestInProgress()
      return deleteInProgress
    } catch (err) {
      return err
    }
  }

  /*async createUserDelete() {
    try {
      const user = await usersDB.findOne({
        _id: new ObjectID(this.id)
      })

      return response
    } catch (err) {
      return err
    }
  }*/

  async deleteUser() {
    try {
      const userData = await usersDB.findOne({ _id: this.id })
      userData.status = "Törölt"

      const deletedUserInsertResult = await deletedUsersDB.insertOne(userData)
      if (deletedUserInsertResult.acknowledged) {
        const deleteUserResult = await usersDB.deleteOne({ _id: userData._id })
        return deleteUserResult
      }
      return deletedUserInsertResult
    } catch (err) {
      return err
    }
  }
}

module.exports = Users
