const DistributionList = require("../models/DistributionList")

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
  res.json("asd")
}

module.exports = {
  createNewDistributionList,
  closeCreateDistributionList
}
