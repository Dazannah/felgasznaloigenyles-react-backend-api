const dotenv = require("dotenv")
dotenv.config()

const jwt = require("jsonwebtoken")

class Jwt {
  constructor(_data) {
    this.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
    this.data = {
      username: _data.username,
      userGroups: _data.userGroups
    }
  }

  sign() {
    const token = jwt.sign(
      {
        exp: this.exp,
        data: this.data
      },
      process.env.JWTSECRET
    )

    return token
  }
}

module.exports = Jwt
