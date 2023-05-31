const Ticket = require("../models/Ticket")

async function createNewUserTicket(req, res) {
  const ticket = new Ticket(req.body)
  const result = await ticket.createNewUserTicket()
  res.json(result)
}

async function getAllRequest(req, res) {
  const requests = await Ticket.prototype.findAll()
  res.json(requests)
}

module.exports = {
  createNewUserTicket,
  getAllRequest
}
