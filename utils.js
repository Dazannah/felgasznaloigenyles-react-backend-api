const classesDB = require("./db").db("jogosultsagigenylo").collection("classes")
const { leftColumn, middleColumn, rightColumn, upperFields } = require("./arrays")

function getArrays() {
  return {
    leftColumn,
    middleColumn,
    rightColumn,
    upperFields
  }
}

async function getAllClass() {
  try {
    const response = await classesDB.find().toArray()

    return response
  } catch (err) {
    return err
  }
}

async function getStartData(req, res) {
  console.log()
  const arrays = getArrays()
  const allClass = await getAllClass()

  res.json([arrays, allClass])
}

module.exports = {
  getStartData
}
