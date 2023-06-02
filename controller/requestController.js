const Ticket = require("../models/Ticket")

async function createNewTicket(req, res) {
  const ticket = new Ticket(req.body.dataToSend)
  const response = await ticket.createNewUserTicket()
  //const result = await ticket.createNewUserTicket()
  res.json(response)
}

async function getAllRequest(req, res) {
  const requests = await Ticket.prototype.findAll()
  res.json(requests)
}

module.exports = {
  createNewTicket,
  getAllRequest
}
