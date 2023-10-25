const ObjectID = require("mongodb").ObjectId

const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const usersDB = require("../db").db("jogosultsagigenylo").collection("users")

class Request {
  constructor(data, process) {
    if (process == "Új felhasználó" || process == "Felhasználó módosítása") {
      this.data = data.dataToSend
      this.data.ticketCreation = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
      this.data.personalInformations.classId = new ObjectID(data.dataToSend.personalInformations.classId)
    }

    if (process == "updatePermission") {
      this.data = data.dataToSend
      this.data.userNames = data.dataToSend.userNames
      this.data.authorizedBy = {
        userName: data.decodedToken.data.username,
        createTime: require("../utils.js").getCurrentTime()
      }
    }

    this.process = process
    this.errors = []
  }

  async validate() {
    try {
      if (!this.data.personalInformations.name) this.errors.push("Név megadása kötelező.")
      if (!this.data.personalInformations.classId) this.errors.push("Osztály megadása kötelező.")
      if (!this.data.personalInformations.classLeader) this.errors.push("Osztályvezető megadása kötelező.")
      if (!this.data.personalInformations.workPost) this.errors.push("Beosztás megadása kötelező.")
      if (!this.data.personalInformations.workLocation) this.errors.push("Munkavégzés hely megadása kötelező.")

      if (this.data.technical) this.data.technical.isTechnical = this.data.technical.isTechnical === "on" ? "Igen" : "Nem"

      if (this.process === "Új felhasználó") {
        this.data.process = "Új felhasználó"
        const havePermissionSelected = this.isThereAnyPermissionChecked()
        if (!havePermissionSelected) this.errors.push("Legalább egy jogosultságot ki kell választani.")
      }

      if (this.process === "Felhasználó módosítása") {
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

  isThereAnyPermissionChecked() {
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

    return isItOkToSave
  }

  async findEditRequestInProgress() {
    try {
      return await requestsDB.findOne({
        $and: [{ userId: new ObjectID(this.data.userId) }, { process: "Felhasználó módosítása" }, { isCompleted: { $nin: [true] } }, { "permission.allowed": { $nin: ["Elutasított"] } }]
      })
    } catch (err) {
      return err
    }
  }

  async findDeletedRequestInProgress() {
    try {
      return await requestsDB.findOne({
        $and: [{ userId: new ObjectID(this.data.userId) }, { process: "Felhasználó törlése" }, { isCompleted: { $nin: [true] } }]
      })
    } catch (err) {
      return err
    }
  }

  async getWhatToChange() {
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

  async createNewUserTicket() {
    try {
      return await requestsDB.insertOne(this.data)
    } catch (err) {
      return err
    }
  }

  async updatePermission() {
    try {
      const result = await requestsDB.findOneAndUpdate(
        {
          _id: new ObjectID(this.data.ticketId)
        },
        {
          $set: this.dataToSave
        }
      )
      return result
    } catch (err) {
      return err
    }
  }

  setDataForUpdatePermission() {
    this.dataToSave = {
      userNames: this.data.userNames,
      permission: {
        allowed: this.data.permission,
        permissionNote: this.data.notes,
        permissionTime: this.data.authorizedBy.createTime,
        authorizedBy: this.data.authorizedBy.userName
      },
      ...(this.data.permission === "Elutasított" ? { completed: { createTime: this.data.authorizedBy.createTime } } : {})
    }
  }
}

module.exports = Request
