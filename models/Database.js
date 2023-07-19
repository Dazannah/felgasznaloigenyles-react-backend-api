const { ObjectId } = require("mongodb")

const database = require("../db").db("jogosultsagigenylo")

const requestsDB = database.collection("requests")
const usersDB = database.collection("users")
const distributionDB = database.collection("distributionLists")

class Database {
  constructor({ collection, _id, accessor, value, userId }) {
    if (collection) this.db = database.collection(collection)
    if (_id) this._id = _id
    if (userId) this.userId = userId
    if (accessor) this.accessor = accessor
    if (value) this.value = value

    userId
  }

  getStatusCondition() {
    if (this.status === "closed") this.condition = { $or: [{ "permission.allowed": "Elutasított" }, { isCompleted: true }] }
    if (this.status === "requestForPermission") this.condition = { "permission.allowed": { $nin: ["Elutasított", "Engedélyezett"] } }
    if (this.status === "allowedRequests") this.condition = { "permission.allowed": "Engedélyezett", isCompleted: { $nin: [true] } }
    if (this.status === "active") this.condition = { status: "Aktív" }
    if (this.status === "deleted") this.condition = { status: "Törölt" }
    if (this.status === "all") return
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
    try {
      return await requestsDB.find().toArray()
    } catch (err) {
      return err
    }
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
      return await this.db.findOne({ _id: new ObjectId(this._id) })
    } catch (err) {
      throw new Error(err)
    }
  }
}

class Serach extends Database {
  constructor({ collection, accessor, value, status, userId }) {
    super({ collection, accessor, value, userId })
    this.status = status
  }

  getQuerry() {
    const querry = []
    if (this.value) querry.push({ [this.accessor]: { $regex: new RegExp(`${this.value}`, "i") } })
    if (this.userId) querry.push({ userId: new ObjectId(this.userId) })
    if (this.condition) querry.push(this.condition)

    return { $and: querry }
  }

  async search() {
    const querry = this.getQuerry()
    try {
      return await this.db.find(querry).toArray()
    } catch (err) {
      return err
    }
  }
}

module.exports = { Database, GetRequestsData, SaveData, GetData, Serach }
