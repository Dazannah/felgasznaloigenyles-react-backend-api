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
  const arrays = getArrays()
  const allClass = await getAllClass()

  res.json([arrays, allClass])
}

function getCurrentTime() {
  let dateObject = new Date()

  let date = ("0" + dateObject.getDate()).slice(-2)
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2)
  let year = dateObject.getFullYear()

  let hours = dateObject.getHours()
  let minutes = dateObject.getMinutes()
  let seconds = dateObject.getSeconds()
  let tempCurrentTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

  return tempCurrentTime
}

module.exports = {
  getStartData,
  getCurrentTime
}
