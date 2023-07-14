const ObjectID = require("mongodb").ObjectId

const database = require("../db").db("jogosultsagigenylo")

const requestsDB = database.collection("requests")
const usersDB = database.collection("users")
const distributionDB = database.collection("distributionLists")

class Database {
  constructor({ collection, _id }) {
    if (collection) this.db = database.collection(collection)
    if (_id) this._id = _id
  }
}
class SaveData extends Database {}

class GetData extends Database {
  constructor({ collection }) {
    super({ collection })
  }

  async getAllFromCollection() {
    try {
      return await this.db.find().toArray()
    } catch (err) {
      throw new Error(err)
    }
  }
}

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

  async findOneById() {
    try {
      return await this.db.findOne({ _id: new ObjectID(this._id) })
    } catch (err) {
      return err
    }
  }
}

module.exports = { Database, GetRequestsData, SaveData, GetData }
