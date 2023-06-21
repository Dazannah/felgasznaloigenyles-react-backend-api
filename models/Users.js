const usersDB = require("../db").db("jogosultsagigenylo").collection("users")
const ObjectID = require("mongodb").ObjectId

const Users = function (data, type) {
  if (type === "getSingleUser") {
    this.id = data
  }
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

module.exports = Users
