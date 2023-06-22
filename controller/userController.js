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
    const user = new Users(req.params.id)
    const response = await user.getSingleUser()
    res.json(response)
  } catch (err) {
    res.json(err)
  }
}

async function requestDeleteUser(req, res) {
  try {
    const userToDelete = new Users(req.params.id, "", req.body.decodedToken)
    const deleteInProgress = await userToDelete.searchForDeletRequest()
    if (deleteInProgress) {
      res.json("A felhasználónak van folyamatban lévő törlési kérelme.")
    } else {
      const response = await userToDelete.createUserDelete()
      res.json(response)
    }
  } catch (err) {
    res.json(err)
  }
}

module.exports = {
  listUsers,
  requestEditUser,
  requestDeleteUser
}
