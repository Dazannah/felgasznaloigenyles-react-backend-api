const Users = require("../models/Users")

async function listUsers(req, res) {
  try {
    const response = await Users.prototype.getAllUser()
    res.json(response)
  } catch (err) {
    res.json(err)
  }
}

async function requestEditUser(req, res) {
  try {
    const user = new Users(req.params.id, "getSingleUser")
    const response = await user.getSingleUser()
    res.json(response)
  } catch (err) {
    res.json(err)
  }
}

async function requestDeleteUser(req, res) {}

module.exports = {
  listUsers,
  requestEditUser,
  requestDeleteUser
}
