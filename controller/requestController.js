const ObjectId = require("mongodb").ObjectId
const Ticket = require("../models/Ticket")
const Request = require("../models/Request")
const { Database, GetRequestsData } = require("../models/Database")
const JSONHandler = require("../models/JSONHandler.js")

const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const jsonHandler = new JSONHandler()

async function createNewUserTicket(req, res) {
  const type = "Új felhasználó"
  const request = new Request(req.body, type)
  const errors = await request.validate()

  if (errors) {
    res.json({ errors: errors })
  } else {
    try {
      const result = await request.createNewUserTicket()

      const data = {
        "name": req.body.dataToSend.personalInformations.name,
        "class": req.body.dataToSend.personalInformations.className,
        "process": type,
        "requestedBy": req.body.decodedToken.data.username,
      }

      await jsonHandler.addEmail( "./json/ujigeny.json", data)

      res.json(result)
    } catch (err) {
      console.log(err)
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

    const data = {
      "name": result.value.personalInformations.name,
      "class": result.value.personalInformations.className,
      "process": result.value.process + " -- " + req.body.dataToSend.permission,
      "requestedBy": result.value.ticketCreation.userName,
    }
    await jsonHandler.addEmail( "./json/engedelyezett.json", data)


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

    const data = {
      "name": closeResult.value.personalInformations.name,
      "class": closeResult.value.personalInformations.className,
      "process": closeResult.value.process,
      "requestedBy": closeResult.value.ticketCreation.userName,
    }
    
    await jsonHandler.addEmail( "./json/elkeszult.json", data)

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
    const {closeDeleteResult, closeTicket} = await ticket.closeDeleteUserRequest()

    const data = {
      "name": closeTicket.value.personalInformations.name,
      "class": closeTicket.value.personalInformations.className,
      "process": closeTicket.value.process,
      "requestedBy": closeTicket.value.ticketCreation.userName,
    }
    await jsonHandler.addEmail( "./json/elkeszult.json", data)

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

      const data = {
        "name": req.body.dataToSend.personalInformations.name,
        "class": req.body.dataToSend.personalInformations.className,
        "process": req.body.dataToSend.process,
        "requestedBy": req.body.dataToSend.ticketCreation.userName,
      }
      await jsonHandler.addEmail( "./json/ujigeny.json", data)

      res.json(result)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  }
}

async function closeEditUserRequest(req, res) {
  const type = "closeEditRequest"
  const ticket = new Ticket(req.body, type)

  try {
    const {response, savedResponse} = await ticket.updateUser()

    console.log(req.body)

    const data = {
      "name": savedResponse.value.personalInformations.name,
      "class": savedResponse.value.personalInformations.className,
      "process": savedResponse.value.process,
      "requestedBy": savedResponse.value.ticketCreation.userName,
    }
    
    await jsonHandler.addEmail( "./json/elkeszult.json", data)

    res.json(response)
  } catch (err) {
    res.json(err)
  }
}

async function updateRequest(req, res){
  const type = "updateRequest"
  const ticket = new Ticket(req.body, type)

  try {
    const response = await ticket.saveUpdatedRequest()
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
  getRequestsForUser,
  updateRequest
}
