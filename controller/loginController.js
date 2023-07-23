const dotenv = require("dotenv")
dotenv.config()

const classesDB = require("../db").db("jogosultsagigenylo").collection("classes")
const { Login, Autherization } = require("../models/Login")
const Jwt = require("../models/Jwt")
const Cookies = require("../models/Cookies")

async function login(req, res) {
  const login = new Login(req.body)

  login.cleaneUp()
  login.validate()

  if (login.errors.length > 0) {
    res.json(login.errors)
  }

  const result = await login.authenticate()

  const jwt = new Jwt(result)
  const token = jwt.sign()

  res.cookie("jwt", token, { httpOnly: true, sameSite: true, maxAge: 1000 * 60 * 60 * 24 }) //maxAge 1 nap
  res.json({ token })
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
  try {
    const cookies = new Cookies(req.headers.cookie)
    const cookieObj = cookies.getCookieObj()

    if (!cookieObj.jwt) {
      return res.status(401).send()
    }

    const jwt = new Jwt(cookieObj)
    const decodedToken = jwt.validate()
    req.body.decodedToken = decodedToken
    next()
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      res.json({ tokenExpired: true })
    } else {
      next(err)
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
