const ActiveDirectory = require("activedirectory")
const dotenv = require("dotenv")
dotenv.config()

let Login = function (data) {
  this.data = data
  this.errors = [""]
  this.userGroups = [""]
}

Login.prototype.cleaneUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = ""
  }
  this.data.username = this.data.username.trim().toLowerCase()
}

Login.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username == "") {
      this.errors.push("Felhasználónév megadása kötelező.")
    }
    if (this.data.password == "") {
      this.errors.push("Jelszó megadása kötelező.")
    }
    resolve()
  })
}

Login.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    this.cleaneUp()
    this.validate()

    if (this.errors.length == 0) {
      reject(new Error(this.errors))
    } else {
      try {
        const result = await this.authenticate()
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }
  })
}

Login.prototype.authenticate = function () {
  let ldapConfig = {
    url: process.env.LDAPURL,
    baseDN: process.env.BASEDN
  }

  const ad = new ActiveDirectory(ldapConfig)

  let usernameWithDomain = this.data.username + process.env.DOMAIN
  let username = this.data.username
  let password = this.data.password
  let errors = this.errors
  let userGroups = this.userGroups

  let opts = {
    bindDN: usernameWithDomain,
    bindCredentials: password
  }

  return new Promise( async (resolve, reject) => {
    
    ad.getGroupMembershipForUser(opts, usernameWithDomain, function (err, groups) {
      if (err) {
        errors.push("ERROR: " + JSON.stringify(err))
        reject(new Error(errors))
      } else if (!groups) {
        errors.push("User: " + usernameWithDomain + " not found.")
        reject(new Error(errors))
      } else {
        groups.forEach(element => {
          if (element.cn == "Tartományfelhasználók") {
            userGroups[0] = element.cn
          } //kérelmezők AD csoport neve
          if (element.cn == "JogosultsagigenyEngedelyezok") {
            userGroups[1] = element.cn
          } //engedélyezők AD csoport neve
          if (element.cn == "JogosultsagigenyAdminisztrator") {
            userGroups[2] = element.cn
          } //létrehozók AD csoport neve
        })

        resolve({ username: username, userGroups: userGroups })
      }
    })

  })

}

module.exports = Login
