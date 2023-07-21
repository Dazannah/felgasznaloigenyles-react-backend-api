const dotenv = require("dotenv")
dotenv.config()
const jwt = require("jsonwebtoken")
const Cookies = require("js-cookie")
const classesDB = require("../db").db("jogosultsagigenylo").collection("classes")
const { Login, Autherization } = require("../models/Login")

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

    res.cookie("jwt", token, { httpOnly: true, sameSite: true, maxAge: 1000 * 60 * 60 * 24 }) //maxAge 1 nap
    res.json({ token })
  } catch (err) {
    res.json(login.errors)
  }
}

function getCookies(rawCookies) {
  if (rawCookies) {
    const splittedCookies = rawCookies.split(";")
    const cookieObject = {}

    splittedCookies.forEach((cookie, index) => {
      splittedCookies[index] = cookie.trim()
    })

    splittedCookies.forEach(cookie => {
      let tmp = cookie.split("=")
      cookieObject[tmp[0]] = tmp[1]
    })

    return cookieObject
  } else {
    return {}
  }
}

async function verifyToken(req, res, next) {
  const cookies = getCookies(req.headers.cookie)

  if (!cookies.jwt) {
    return res.status(401).send()
  }

  try {
    const decodedToken = await jwt.verify(cookies.jwt, process.env.JWTSECRET)
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

function applicants(req, res, next) {
  const authorization = new Autherization(req.body.decodedToken.data.userGroups)
  const isAuthorized = authorization.isApplicant()

  if (isAuthorized) {
    next()
  } else {
    res.status(403).send()
  }
}

function authorizers(req, res, next) {
  const authorization = new Autherization(req.body.decodedToken.data.userGroups)
  const isAuthorized = authorization.isAuthorizer()

  if (isAuthorized) {
    next()
  } else {
    res.status(403).send()
  }
}

function administrators(req, res, next) {
  const authorization = new Autherization(req.body.decodedToken.data.userGroups)
  const isAuthorized = authorization.isAdministrator()

  if (isAuthorized) {
    next()
  } else {
    res.status(403).send()
  }
}

function administratorsAndAuthorizers(req, res, next) {
  const authorization = new Autherization(req.body.decodedToken.data.userGroups)
  const isAuthorized = authorization.isAdministratorOrAuthorizer()

  if (isAuthorized) {
    next()
  } else {
    res.status(403).send()
  }
}

module.exports = {
  login,
  verifyToken,
  engedejezok,
  applicants,
  authorizers,
  administrators,
  administratorsAndAuthorizers
}
