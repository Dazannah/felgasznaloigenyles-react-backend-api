const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const server = require('http').createServer(app)
const router = require('./router')

app.use('/', router)

module.exports = server