const dotenv = require('dotenv')
dotenv.config()
const jwt = require("jsonwebtoken")

const Login = require('../models/Login')

async function login(req, res){
    let login = new Login(req.body)
try{
    let result = await login.login()
    const token = await jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 *24),
        data: {
            username: result.username
        }
      }, process.env.JWTSECRET)
      result.token = token
    res.json(result)
}catch(err){
    res.json("Error: " + login.errors)
}
}

async function verifyToken(req, res, next){
    const token = req.body.token
    try{
        var decoded = await jwt.verify(token, process.env.JWTSECRET)
            next()
    }catch(err){
        res.json(err)
    }
}

function testNext(req, res){
    res.json(req.body)
}

function testGet(req, res){
    res.json("testGet")
}

module.exports = {
    login,
    verifyToken,
    testNext,
    testGet
}