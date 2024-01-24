const { ObjectId } = require("mongodb")
const { GetRequestsData } = require("./Database")

const requestsDB = require("../db").db("jogosultsagigenylo").collection("requests")
const distributionDB = require("../db").db("jogosultsagigenylo").collection("distributionLists")

class DistributionList {
  constructor(distributionListAddres, addresses, username) {
    //is.data = {distributionListAddres, addresses}
    const creationData = {
      userName: username,
      createTime: require("../utils.js").getCurrentTime()
    }

    this.dataToSave = {      
        email: distributionListAddres,
        emailRedirects: addresses,
        ticketCreation: creationData,
        isCompleted: true,
        completed: creationData,
        process: "Új terjesztési lista"
    }

    this.errors = []
  }

  /*async validateData() {
    if (this.data.distributionListAddres === "") {
      this.errors.push(`Terjesztési lista cím megadása kötelező.`)
    } else {
      const splitIt = this.data.distributionListAddy.split("@")
      this.create = {
        mainAddress: splitIt[0],
        addresses: []
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
        this.create.addresses.push(splitIt[0])
      }
    }

    return this.errors
  }*/

  /*async createNewDistributionRequest() {
    try {
      const insertResult = await requestsDB.insertOne({
        mainAddress: this.create.mainAddress,
        addresses: this.create.addresses,
        ticketCreation: this.data.creationData,
        process: "Új terjesztési lista"
      })

      return insertResult
    } catch (err) {
      return JSON.stringify(err)
    }
  }*/
}

class CloseNewDistributionList extends DistributionList {
  constructor(distributionListAddres, addresses, username) {
    super(distributionListAddres, addresses, username)
  }

  /*async getDataToSave(){
    try{
      const getRequestData = new GetRequestsData({collection: "requests", _id: `${this.data.dataToSend.ticketId}`})
      const ticketToClose = await getRequestData.findOneById()
  
      this.dataToSave = {
        mainAddress: ticketToClose.mainAddress,
        addresses: ticketToClose.addresses,
        status: "Aktív",
        createTime: this.data.creationData.createTime
      }

    }catch(err){
      throw new Error(err)
    }

  }*/

  /*async saveDistributionList() {
    try{
      const result = await distributionDB.insertOne(this.dataToSave)
      this.insertedId = result.insertedId
    }catch(err){
      throw new Error(err)
    }
  }*/

  async save(){
    try{
      const response = await requestsDB.insertOne(this.dataToSave)
    }catch(err){
      throw new Error(err)
    }
  }
}

module.exports = { DistributionList, CloseNewDistributionList }
