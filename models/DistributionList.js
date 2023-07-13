const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const distributionDB = require("../db").db("jogosultsagigenylo").collection("distributionLists")

class DistributionList {
  constructor(data) {
    this.data = data
    this.data.creationData = {
      userName: data.decodedToken.data.username,
      createTime: require("../utils.js").getCurrentTime()
    }
    this.errors = []
  }

  async validateData() {
    if (this.data.dataToSend.distributionListAddy === "") {
      this.errors.push(`Terjesztési lista cím megadása kötelező.`)
    } else {
      const splitIt = this.data.dataToSend.distributionListAddy.split("@")
      this.create = {
        mainAddress: splitIt[0],
        adresses: []
      }
    }

    const isItTaken = await distributionDB.findOne({
      mainAddress: this.create.mainAddress
    })

    if (isItTaken) this.errors.push(`Ez a terjesztési lista cím már foglalt.`)

    const keys = Object.keys(this.data.dataToSend).slice(1)

    for (let i = 0; i < keys.length; i++) {
      if (this.data.dataToSend[keys[i]] === "") {
        this.errors.push(`${i + 1}. email címet meg kell adni.`)
      } else {
        const splitIt = this.data.dataToSend[keys[i]].split("@")
        this.create.adresses.push(splitIt[0])
      }
    }

    return this.errors
  }

  async createNewDistributionRequest() {
    try {
      const insertResult = await requestsDB.insertOne({
        mainAddress: this.create.mainAddress,
        adresses: this.create.adresses,
        ticketCreation: this.data.creationData,
        process: "Új terjesztési lista"
      })

      return insertResult
    } catch (err) {
      return JSON.stringify(err)
    }
  }
}

class CloseNewDistributionList extends DistributionList {
  constructor(data) {
    super(data)
  }

  async closeNewDistributionList() {
    console.log(this.data.creationData)
  }

  async saveDL() {}
}

module.exports = { DistributionList, CloseNewDistributionList }
