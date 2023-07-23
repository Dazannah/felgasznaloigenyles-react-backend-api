const ObjectId = require("mongodb").ObjectId
const Ticket = require("../models/Ticket")
const Request = require("../models/Request")
const { Database, GetRequestsData } = require("../models/Database")

const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")

async function createNewUserTicket(req, res) {
  const type = "Új felhasználó"
  const request = new Request(req.body, type)
  const errors = await request.validate()

  if (errors) {
    res.json({ errors: errors })
  } else {
    try {
      const result = await request.createNewUserTicket()
      res.json(result)
    } catch (err) {
      res.json(err)
    }
  }
}

async function getAllForPermission(req, res) {
  try {
    const requests = await GetRequestsData.prototype.getAllRequestForPermission()
    res.json(requests)
  } catch (err) {
    res.json(err)
  }
}

async function updateTicketPermission(req, res) {
  try {
    const type = "updatePermission"
    const request = new Request(req.body, type)
    request.setDataForUpdatePermission()
    const result = await request.updatePermission()

    res.json(result)
  } catch (err) {
    res.json(err)
  }
}

async function getAllowedTickets(req, res) {
  try {
    const allowedTickets = await GetRequestsData.prototype.getAllowedTickets()
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
    const response = await GetRequestsData.prototype.getCompletedTickets()
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
    const response = await ticket.updateUser()
    res.json(response)
  } catch (err) {
    res.json(err)
  }
}

async function getRequestsForUser(req, res) {
  try {
    const userRequests = await requestsDB
      .find({
        userId: new ObjectId(req.params.id)
      })
      .toArray()
    res.json(userRequests)
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
  closeEditUserRequest,
  getRequestsForUser
}
