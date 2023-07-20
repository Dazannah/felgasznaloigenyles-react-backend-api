const ActiveDirectory = require("activedirectory2")
const dotenv = require("dotenv")

dotenv.config()

let Login = function (data) {
  this.data = data
  this.errors = []
  this.userGroups = [""]
}

Login.prototype.cleaneUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = ""
  }
  this.data.username = this.data.username.trim().toLowerCase()
}

Login.prototype.validate = function () {
  if (this.data.username == "" || this.data.username == null) {
    this.errors.push("Felhasználónév megadása kötelező.")
  }
  if (this.data.password == "" || this.data.password == null) {
    this.errors.push("Jelszó megadása kötelező.")
  }
}

Login.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    this.cleaneUp()
    this.validate()

    if (this.errors.length > 0) {
      reject(this.errors)
    } else {
      try {
        const result = await this.authenticate()
        resolve(result)
      } catch (err) {
        reject(this.errors)
      }
    }
  })
}

Login.prototype.authenticate = function () {
  let usernameWithDomain = this.data.username + process.env.DOMAIN
  let username = this.data.username
  let password = this.data.password
  let errors = this.errors
  let userGroups = this.userGroups

  let ldapConfig = {
    url: process.env.LDAPURL,
    baseDN: process.env.BASEDN,
    username: usernameWithDomain,
    password
  }

  const ad = new ActiveDirectory(ldapConfig)

  /*let opts = {
    bindDN: usernameWithDomain,
    bindCredentials: password
  }*/

  return new Promise(async (resolve, reject) => {
    let runCount = 0

    ad.getGroupMembershipForUser(usernameWithDomain, (err, groups) => {
      if (err) {
        const errorMessage = JSON.stringify(err)
        const errorMessageObject = JSON.parse(errorMessage)

        if (errorMessageObject.lde_dn === null && runCount > 0) errors.push("Hibás flehasználónév/jelszó.")
        if (errorMessageObject.code === "ENOTFOUND") errors.push("A hitelesítő szerver nem elérhető.")
        runCount++

        reject(new Error(errors))
      } else if (!groups) {
        errors.push("Nincs jogosultságod az alkalmazás használatához.")
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

class Autherization {
  constructor(userGroups){
    this.userGroups = userGroups
  }

  getAccess(authorizationLevel){
    let isAuthorized = false //in prod set it false

    this.userGroups.forEach(group =>{
      if(group === authorizationLevel) isAuthorized = true
    })

    return isAuthorized
  }

  isApplicant(){
    return this.getAccess("Tartományfelhasználók")
  }

  isAuthorizer(){
    return this.getAccess("JogosultsagigenyEngedelyezok")
  }

  isAdministrator(){
    return this.getAccess("JogosultsagigenyAdminisztrator")
  }


}

module.exports = {Login, Autherization}
