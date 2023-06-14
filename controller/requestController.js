const Ticket = require("../models/Ticket")

async function createNewUserTicket(req, res) {
  const ticket = new Ticket(req.body, req.body.process)
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

async function updateTicketPermission(req, res) {
  const type = "updatePermission"
  const ticket = new Ticket(req.body.values, type)
  const result = await ticket.updatePermission()
  console.log(result)
}

module.exports = {
  createNewUserTicket,
  getAllRequest,
  updateTicketPermission
}
