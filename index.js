const express = require("express")
const path = require("path")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const server = require("http").createServer(app)
const router = require("./router")

app.use("/api", router)

//app.use(express.static(path.join(__dirname, "dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.use((err, req, res, next) => {
  res.json(`${err}`)
})

module.exports = server
