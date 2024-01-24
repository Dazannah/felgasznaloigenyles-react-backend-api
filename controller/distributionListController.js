const { DistributionList, CloseDistributionList } = require("../models/DistributionList")
const DistributionListsApi = require("../models/DistributionListsApi")
const { GetData } = require("../models/Database")

async function createNewDistributionList(req, res) {
  const username = req.body.decodedToken.data.username
  const distributionListAddres = req.body.dataToSend.distributionListAddy
  const addresses = []

  for(const addy in req.body.dataToSend){
    if(/email/.test(addy)) addresses.push(req.body.dataToSend[addy])
  }

  const distributionList = new DistributionListsApi()
  distributionList.createDisributionList(username, distributionListAddres, addresses, res)
}

async function closeCreateDistributionList(req, res) {
  try {
    const distributionList = new CloseDistributionList(req.body)
    await distributionList.getDataToSave()
    await distributionList.saveDistributionList()
    await distributionList.closeRequest()

    res.json("A terjesztési lista sikeresen elkészült.")
  } catch (err) {
    res.json(err)
  }
}

async function getDistributionLists(req, res) {
  try {
    const distributionListsApi = new DistributionListsApi()
    distributionListsApi.getDistributionLists(res)
  } catch (err) {
    res.json(err)
  }
}

async function deleteDistributionlist(req, res){
  try {
    const distributionListAddres = req.body.toDelete.split("@")

    const username = req.body.decodedToken.data.username
    const distributionListsApi = new DistributionListsApi()
    distributionListsApi.deleteDistributionList(res, distributionListAddres[0], username)
  } catch (err) {
    res.json(err)
  }
}

module.exports = {
  createNewDistributionList,
  closeCreateDistributionList,
  getDistributionLists,
  deleteDistributionlist
}
