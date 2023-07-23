const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const usersDB = require("../db").db("jogosultsagigenylo").collection("users")
const ObjectID = require("mongodb").ObjectId
const Users = require("./Users")

/*const TicketSerializers = {
  "Új felhasználó":  (data, decodedToken)=>{
    const ticketData ={
      data: data.dataToSend,
      ticketCreation: {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      },
      personalInformations.classId: new ObjectID(data.dataToSend.personalInformations.classId)
    }
  }
}

const Ticket = function (data, type) {
  const serializer = TicketSerializers[type]
  if (serializer) {
    this.data = serializer(data, data.decodedToken)
  } else {
    this.data = data.dataToSend
  }
  this.data.process = type
  this.errors = []
}*/

const Ticket = function (data, type) {
  try {
    if (type == "Új felhasználó" || type == "Felhasználó módosítása") {
      this.data = data.dataToSend
      this.data.ticketCreation = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
      this.data.personalInformations.classId = new ObjectID(data.dataToSend.personalInformations.classId)
    }

    if (type == "updatePermission") {
      this.data = data.dataToSend
      this.data.userNames = data.dataToSend.userNames
      this.data.authorizedBy = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
    }

    if (type == "closeNewUserTicket") {
      this.data = data.dataToSend
      this.data.createdBy = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
    }

    if (type == "searchDeleteInProgress") {
      this.data = data
    }

    if (type === "Felhasználó törlése") {
      //
      this.data = data.user
      this.data.ticketCreation = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
      this.data.userId = this.data._id
      delete this.data._id
    }
    if (type === "closeDeleteUserRequest") {
      this.data = { ticketId: data.values.ticketId }
      this.data.createdBy = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
    }
    if (type === "closeEditRequest") {
      this.data = data.dataToSend
      this.data.createdBy = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
    }
    this.data.process = type
    this.errors = []
  } catch (err) {
    this.errors = []
    return JSON.stringify(err)
  }
}

Ticket.prototype.validate = async function () {
  try {
    if (!this.data.personalInformations.name) this.errors.push("Név megadása kötelező.")
    if (!this.data.personalInformations.classId) this.errors.push("Osztály megadása kötelező.")
    if (!this.data.personalInformations.classLeader) this.errors.push("Osztályvezető megadása kötelező.")
    if (!this.data.personalInformations.workPost) this.errors.push("Beosztás megadása kötelező.")
    if (!this.data.personalInformations.workLocation) this.errors.push("Munkavégzés hely megadása kötelező.")

    if (this.data.technical) this.data.technical.isTechnical = this.data.technical.isTechnical === "on" ? "Igen" : "Nem"

    if (this.data.process === "Új felhasználó") {
      const havePermissionSelected = this.isThereAnyPermissionChecked()
      if (!havePermissionSelected) this.errors.push("Legalább egy jogosultságot ki kell választani.")
    }

    if (this.data.process === "Felhasználó módosítása") {
      const isEditInProgress = await this.findEditRequestInProgress()
      const isDeletInProgress = await this.findDeletedRequestInProgress()
      if (isEditInProgress) {
        this.errors.push("A felhasználónak van folyamatban lévő módosítási igénye.")
      } else if (isDeletInProgress) {
        this.errors.push("A felhasználó törlése folyamatban, így nem lehet módosítást ígényelni.")
      } else {
        this.data.userId = new ObjectID(this.data.userId)
        const whatToChange = await this.getWhatToChange()

        if (whatToChange.add.length == 0 && whatToChange.delete.length == 0 && whatToChange.edit.length == 0 && this.data.createTextArea == "") {
          this.errors.push("Legalább egy módosítást végre kell hajtani.")
        } else {
          this.data.change = whatToChange
        }
      }
    }

    if (this.errors.length > 0) return this.errors
  } catch (e) {
    this.errors.push(JSON.stringify(e))
    return this.errors
  }
}

Ticket.prototype.isThereAnyPermissionChecked = function () {
  let isItOkToSave = false

  this.data.userPermissionsLeft.forEach(permission => {
    if (permission.value === true) isItOkToSave = true
  })

  this.data.userPermissionsMiddle.forEach(permission => {
    if (permission.value === true) isItOkToSave = true
  })

  this.data.userPermissionsRight.forEach(permission => {
    if (permission.value === true) isItOkToSave = true
  })

  if (isItOkToSave) {
    return true
  } else {
    return false
  }
}

Ticket.prototype.createNewUserTicket = async function () {
  try {
    const result = await requestsDB.insertOne(this.data)
    return result
  } catch (err) {
    return err
  }
}

Ticket.prototype.updatePermission = async function () {
  try {
    let response
    if (this.data.permission === "Elutasított") {
      response = await requestsDB.findOneAndUpdate(
        {
          _id: new ObjectID(this.data.ticketId)
        },
        {
          $set: {
            userNames: this.data.userNames,
            permission: {
              allowed: this.data.permission,
              permissionNote: this.data.notes,
              permissionTime: this.data.authorizedBy.createTime,
              authorizedBy: this.data.authorizedBy.userName
            },
            completed: {
              createTime: this.data.authorizedBy.createTime
            }
          }
        }
      )
    } else {
      response = await requestsDB.findOneAndUpdate(
        {
          _id: new ObjectID(this.data.ticketId)
        },
        {
          $set: {
            userNames: this.data.userNames,
            permission: {
              allowed: this.data.permission,
              permissionNote: this.data.notes,
              permissionTime: this.data.authorizedBy.createTime,
              authorizedBy: this.data.authorizedBy.userName
            }
          }
        }
      )
    }

    return response
  } catch (err) {
    return err
  }
}

Ticket.prototype.closeNewUserTicket = async function () {
  try {
    const response = await requestsDB.findOneAndUpdate(
      {
        _id: new ObjectID(this.data.ticketId)
      },
      {
        $set: {
          userNames: this.data.userNames,
          completed: this.data.createdBy,
          isCompleted: true,
          userId: new ObjectID(this.createdUser.insertedId)
        }
      }
    )
    return response
  } catch (err) {
    return err
  }
}

Ticket.prototype.createUser = async function () {
  try {
    const ticketData = await requestsDB.findOne({
      _id: new ObjectID(this.data.ticketId)
    })
    delete ticketData.personalInformations.ticketId
    const userData = {
      userNames: this.data.userNames,
      personalInformations: ticketData.personalInformations,
      userPermissionsLeft: ticketData.userPermissionsLeft,
      userPermissionsMiddle: ticketData.userPermissionsMiddle,
      userPermissionsRight: ticketData.userPermissionsRight,
      technical: ticketData.technical,
      createTime: this.data.createdBy.createTime,
      status: "Aktív"
    }
    try {
      this.createdUser = await usersDB.insertOne(userData)
      return "ok"
    } catch (err) {
      return err
    }
  } catch (err) {
    return err
  }
}

Ticket.prototype.findDeletedRequestInProgress = async function () {
  try {
    const deletInProgress = await requestsDB.findOne({
      $and: [{ userId: new ObjectID(this.data.userId) }, { process: "Felhasználó törlése" }, { isCompleted: { $nin: [true] } }]
    })
    return deletInProgress
  } catch (err) {
    return err
  }
}

Ticket.prototype.findEditRequestInProgress = async function () {
  try {
    const editInProgress = await requestsDB.findOne({
      $and: [{ userId: new ObjectID(this.data.userId) }, { process: "Felhasználó módosítása" }, { isCompleted: { $nin: [true] } }, { "permission.allowed": { $nin: ["Elutasított"] } }]
    })

    return editInProgress
  } catch (err) {
    return err
  }
}

Ticket.prototype.createDeleteTicket = async function () {
  try {
    const response = await requestsDB.insertOne(this.data)
    return response
  } catch (err) {
    return err
  }
}

Ticket.prototype.closeDeleteUserRequest = async function () {
  try {
    const wholeTicket = await requestsDB.findOne({ _id: new ObjectID(this.data.ticketId) })
    const user = new Users(wholeTicket.userId)
    const deleteResult = await user.deleteUser()
    if (deleteResult.acknowledged === true) {
      try {
        const closeTicket = await requestsDB.findOneAndUpdate(
          {
            _id: new ObjectID(wholeTicket._id)
          },
          {
            $set: {
              completed: this.data.createdBy,
              isCompleted: true
            }
          }
        )
        return "Felhasználó törlése sikeres"
      } catch (err) {
        return err
      }
    } else {
      return deleteResult
    }
  } catch (err) {
    return err
  }
}

Ticket.prototype.getWhatToChange = async function () {
  const user = await usersDB.findOne({ _id: this.data.userId })
  const objectToCheck = ["userPermissionsLeft", "userPermissionsMiddle", "userPermissionsRight"]

  const whatToChange = {
    add: [],
    delete: [],
    edit: []
  }

  for (const property in user.personalInformations) {
    if (property != "ticketId") {
      if (String(user.personalInformations[property]) != String(this.data.personalInformations[property])) {
        whatToChange.edit.push({ route: "personalInformations", name: property })
      }
    }
  }

  for (const property in user.userNames) {
    if (user.userNames[property] != this.data.userNames[property]) {
      whatToChange.edit.push({ route: "userNames", name: property })
    }
  }

  for (let i = 0; i < objectToCheck.length; i++) {
    let objectToCheckProperty = objectToCheck[i]

    for (const property in user[objectToCheckProperty]) {
      if (user[objectToCheckProperty][property].value != this.data[objectToCheckProperty][property].value) {
        if (this.data[objectToCheckProperty][property].value === true) {
          whatToChange.add.push({ route: objectToCheckProperty, name: this.data[objectToCheckProperty][property].name })
        } else {
          whatToChange.delete.push({ route: objectToCheckProperty, name: this.data[objectToCheckProperty][property].name })
        }
      }
    }
  }

  return whatToChange
}

Ticket.prototype.updateUser = async function () {
  try {
    const ticket = await requestsDB.findOne({ _id: new ObjectID(this.data.ticketId) })

    const userUpdateData = {
      userNames: this.data.userNames,
      personalInformations: ticket.personalInformations,
      userPermissionsLeft: ticket.userPermissionsLeft,
      userPermissionsMiddle: ticket.userPermissionsMiddle,
      userPermissionsRight: ticket.userPermissionsRight
    }

    await usersDB.findOneAndUpdate(
      { _id: ticket.userId },
      {
        $set: userUpdateData
      }
    )

    await requestsDB.findOneAndUpdate(
      { _id: new ObjectID(this.data.ticketId) },
      {
        $set: {
          completed: this.data.createdBy,
          isCompleted: true
        }
      }
    )

    return "Módosítás sikeresen mentve."
  } catch (err) {
    return err
  }
}

module.exports = Ticket
