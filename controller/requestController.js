const Ticket = require("../models/Ticket")

async function createNewUserTicket(req, res) {
  const ticket = new Ticket(req.body, req.body.process)
  const errors = ticket.validate()

  if (errors) {
    res.json({ errors: errors })
  } else {
    try {
      const result = await ticket.createNewUserTicket()
      console.log(result)
      res.json(result)
    } catch (err) {
      res.json(err)
    }
  }
}

async function getAllForPermission(req, res) {
  try {
    const requests = await Ticket.prototype.getAllForPermission()
    res.json(requests)
  } catch (err) {
    res.json(err)
  }
}

async function updateTicketPermission(req, res) {
  const type = "updatePermission"
  const ticket = new Ticket(req.body, type)

  try {
    const result = await ticket.updatePermission()
    res.json(result)
  } catch (err) {
    res.json(err)
  }
}

async function getAllowedTickets(req, res) {
  try {
    const allowedTickets = await Ticket.prototype.getAllowedTickets()
    res.json(allowedTickets)
  } catch (err) {
    res.json(err)
  }
}

async function closeNewUserTicket(req, res) {
  const type = "closeNewUserTicket"
  const ticket = new Ticket(req.body, type)

  try {
    await ticket.createUser()
    const closeResult = await ticket.closeNewUserTicket()
    res.json(closeResult)
  } catch (err) {
    res.json(err)
  }
}

async function completedTickets(req, res) {
  try {
    const response = await Ticket.prototype.getCompletedTickets()
    res.json(response)
  } catch (err) {
    res.json(err)
  }
}

async function closeDeleteUserRequest(req, res) {
  const ticket = new Ticket(req.body, "closeDeleteUserRequest")
  try {
    const closeDeleteResult = await ticket.closeDeleteUserRequest()
    res.json(closeDeleteResult)
  } catch (err) {
    res.json(err)
  }
}

async function saveEditRequest(req, res) {
  const ticket = new Ticket(req.body, req.body.process)
  const errors = await ticket.validate()

  if (errors) {
    res.json({ errors: errors })
  } else {
    try {
      const result = await ticket.createNewUserTicket()
      res.json(result)
    } catch (err) {
      res.json(err)
    }
  }
}

async function closeEditUserRequest(req, res) {
  const type = "closeEditRequest"
  const ticket = new Ticket(req.body, type)

  try {
    await ticket.updateUser()
    /*await ticket.createUser()
    const closeResult = await ticket.closeNewUserTicket()
    res.json(closeResult)*/
  } catch (err) {
    res.json(err)
  }
}

module.exports = {
  createNewUserTicket,
  getAllForPermission,
  updateTicketPermission,
  getAllowedTickets,
  closeNewUserTicket,
  completedTickets,
  closeDeleteUserRequest,
  saveEditRequest,
  closeEditUserRequest
}
