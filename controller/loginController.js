const dotenv = require("dotenv")
dotenv.config()
const jwt = require("jsonwebtoken")
const classesDB = require("../db").db("jogosultsagigenylo").collection("classes")
const {Login, Autherization} = require("../models/Login")

async function login(req, res) {
  let login = new Login(req.body)
  try {
    let result = await login.login()
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        data: {
          username: result.username,
          userGroups: result.userGroups
        }
      },
      process.env.JWTSECRET
    )

    res.json({ token })
  } catch (err) {
    res.json(login.errors)
  }
}

async function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.json("You must provide jwt in the headers.")
  }
  const [type, token] = req.headers.authorization.split(" ")

  try {
    const decodedToken = await jwt.verify(token, process.env.JWTSECRET)
    req.body.decodedToken = decodedToken
    next()
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      res.json({ tokenExpired: true })
    } else {
      res.json(err)
    }
  }
}

function engedejezok(req, res, next) {
  if (req.body.decodedToken.userGroups.data) {
    if (req.body.decodedToken.userGroups[1] == "JogosultsagigenyEngedelyezok") {
      next()
    } else {
      res.json({ err: "Nincs jogosultságod ehhez a felülethez." })
    }
  } else {
    res.json({ err: "Nincs jogosultságod ehhez a felülethez." })
  }
}

function applicants(req, res, next){
  const authorization = new Autherization(req.body.decodedToken.data.userGroups)
  const isAuthorized = authorization.isApplicant()

  if(isAuthorized){
    next()
  }else{
    res.status(403).send()
  }
}

function authorizers(req, res, next){
  const authorization = new Autherization(req.body.decodedToken.data.userGroups)
  const isAuthorized = authorization.isAuthorizer()

  if(isAuthorized){
    next()
  }else{
    res.status(403).send()
  }
}

function administrators(req, res, next){
  const authorization = new Autherization(req.body.decodedToken.data.userGroups)
  const isAuthorized = authorization.isAdministrator()

  if(isAuthorized){
    next()
  }else{
    res.status(403).send()
  }
}

module.exports = {
  login,
  verifyToken,
  engedejezok,
  applicants,
  authorizers,
  administrators
}
