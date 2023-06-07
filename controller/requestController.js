const Ticket = require("../models/Ticket")

async function createNewUserTicket(req, res) {
  const ticket = new Ticket(req.body, "newRequest")
  const errors = ticket.validate()

  if (errors) {
    res.json({ errors: errors })
  } else {
    try {
      const result = await ticket.createNewUserTicket()
      res.json(result)
    } catch (e) {
      res.json(e)
    }
  }
}

async function getAllRequest(req, res) {
  const requests = await Ticket.prototype.findAll()
  res.json(requests)
}

module.exports = {
  createNewUserTicket,
  getAllRequest
}
