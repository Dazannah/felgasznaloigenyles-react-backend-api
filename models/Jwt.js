const dotenv = require("dotenv")
dotenv.config()

const jwtPackage = require("jsonwebtoken")

class Jwt {
  constructor(_data) {
    this.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
    this.data = {
      username: _data.username,
      userGroups: _data.userGroups
    }
    this.jwt = _data.jwt
  }

  sign() {
    const token = jwtPackage.sign(
      {
        exp: this.exp,
        data: this.data
      },
      process.env.JWTSECRET
    )

    return token
  }

  validate() {
    const decodedToken = jwtPackage.verify(this.jwt, process.env.JWTSECRET)
    return decodedToken
  }
}

module.exports = Jwt
