const { Serach } = require("../models/Database")
const DistributionListsApi = require("../models/DistributionListsApi")

async function tableHeadSearch(req, res) {
  try {
    const search = new Serach({ collection: req.body.collection, accessor: req.body.accessor, value: req.body.value, status: req.body.status, userId: req.body.userId, order: req.body.order })
    search.getStatusCondition()
    const result = await search.search()

    res.json(result)
  } catch (err) {
    res.json(err)
  }
}

async function distributionlistSearch(req, res){
  const accessor = req.body.accessor
  const value = req.body.value

  try {
    const distributionListsApi = new DistributionListsApi()
    distributionListsApi.getDistributionLists(res, accessor, value)
  } catch (err) {
    res.json(err)
  }

}

module.exports = {
  tableHeadSearch,
  distributionlistSearch
}
