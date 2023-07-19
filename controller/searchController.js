const { Serach } = require("../models/Database")

async function tableHeadSearch(req, res) {
  try {
    const search = new Serach({collection: req.body.collection, accessor: req.body.accessor, value: req.body.value, status: req.body.status})
    console.log(search)
    const condition = search.getStatusCondition()
    const result = await search.search(condition)

    res.json(result)
  } catch (err) {
    res.json(err)
  }
}

module.exports = {
  tableHeadSearch
}
