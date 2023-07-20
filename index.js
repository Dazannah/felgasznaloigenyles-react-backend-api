const express = require('express')
const path = require("path")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const server = require('http').createServer(app)
const router = require('./router')

app.use(express.static('public'))

app.use(express.static(path.join(__dirname, "public")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.use('/api', router)

module.exports = server