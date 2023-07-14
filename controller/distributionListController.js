const { DistributionList, CloseNewDistributionList } = require("../models/DistributionList")

async function createNewDistributionList(req, res) {
  const distributionList = new DistributionList(req.body)
  const errors = await distributionList.validateData()

  if (errors.length > 0) {
    res.json({ errors: errors })
  } else {
    try {
      const createResult = await distributionList.createNewDistributionRequest()
      res.json(createResult)
    } catch (err) {
      res.json(JSON.stringify(err))
    }
  }
}

async function closeCreateDistributionList(req, res) {
  try{
    const distributionList = new CloseNewDistributionList(req.body)
    await distributionList.getDataToSave()
    await distributionList.saveDistributionList()
    await distributionList.closeRequest()

    res.json("A terjesztési lista sikeresen elkészült.")

  }catch(err){
    console.log(err)
    res.json(err)
  }

}

module.exports = {
  createNewDistributionList,
  closeCreateDistributionList
}
