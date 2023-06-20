const usersDB = require("../db").db("jogosultsagigenylo").collection("users")
const ObjectID = require("mongodb").ObjectId

const Users = function (data, type) {}

Users.prototype.getAllUser = async function () {
  try {
    const users = await usersDB.find().sort({ "personalInformations.name": -1 }).toArray()
    return users
  } catch (err) {
    return err
  }
}

module.exports = Users
