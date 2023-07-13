const ObjectID = require("mongodb").ObjectId

const database = require("../db").db("jogosultsagigenylo")

const requestsDB = database.collection("requests")
const usersDB = database.collection("users")
const distributionDB = database.collection("distributionLists")

class Database {
  constructor() {}
}
class SaveData extends Database {}
class GetRequestsData extends Database {
  async reUsableFind(conditions) {
    const response = await requestsDB.find(conditions).toArray()

    return response
  }

  async getAllRequestForPermission() {
    try {
      const response = await this.reUsableFind({
        "permission.allowed": { $nin: ["Elutasított", "Engedélyezett"] }
      })

      return response
    } catch (err) {
      return err
    }
  }

  async getAllowedTickets() {
    try {
      const response = await this.reUsableFind({
        "permission.allowed": "Engedélyezett",
        isCompleted: { $nin: [true] }
      })

      return response
    } catch (err) {
      return err
    }
  }

  async getCompletedTickets() {
    try {
      const response = await this.reUsableFind({
        $or: [{ "permission.allowed": "Elutasított" }, { isCompleted: true }]
      })

      return response
    } catch (err) {
      return err
    }
  }
}

module.exports = { Database, GetRequestsData, SaveData }
