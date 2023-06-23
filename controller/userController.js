const Users = require("../models/Users")
const Ticket = require("../models/Ticket")

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
    const ticket = new Ticket({ userId: req.params.id }, "searchDeleteInProgress")
    const isDeleteInProgress = await ticket.findDeletedRequestInProgress()

    if (isDeleteInProgress) {
      res.json("A felhasználónak van folyamatban lévő törlési kérelme.")
    } else {
      const user = new Users(req.params.id)
      const userWholeData = await user.getSingleUser()

      const ticket = new Ticket({ user: userWholeData, decodedToken: req.body.decodedToken }, "Felhasználó törlése")
      const response = await ticket.createDeleteTicket()
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
