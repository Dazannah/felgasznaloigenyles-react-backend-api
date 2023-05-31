const dotenv = require("dotenv")
dotenv.config()
const jwt = require("jsonwebtoken")
const classesDB = require("../db").db("jogosultsagigenylo").collection("classes")
const Login = require("../models/Login")

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
    res.json("Error: " + login.errors)
  }
}

async function verifyToken(req, res, next) {
  const token = req.body.token
  try {
    const decodedToken = await jwt.verify(token, process.env.JWTSECRET)
    req.body.decodedToken = decodedToken
    next()
  } catch (err) {
    res.json(err)
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

module.exports = {
  login,
  verifyToken,
  engedejezok
}
