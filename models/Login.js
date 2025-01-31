const ActiveDirectory = require("activedirectory2")
const dotenv = require("dotenv")

dotenv.config()

class Login {
  constructor(data) {
    this.usernameWithDomain = data.username + process.env.DOMAIN
    this.username = data.username
    this.password = data.password

    this.errors = []
    this.userGroups = [""]
  }

  cleaneUp() {
    if (typeof this.username != "string") this.username = ""
    if (typeof this.password != "string") this.username = ""

    this.username = this.username.trim().toLowerCase()
  }

  validate() {
    if (this.username == "" || this.username == null) {
      this.errors.push("Felhasználónév megadása kötelező.")
    }
    if (this.password == "" || this.password == null) {
      this.errors.push("Jelszó megadása kötelező.")
    }
  }

  async authenticate() {
    try {
      let ldapConfig = {
        url: process.env.LDAPURL,
        baseDN: process.env.BASEDN,
        username: this.usernameWithDomain,
        password: this.password
      }

      const ad = new ActiveDirectory(ldapConfig)

      return new Promise((resolve, reject) => {
        ad.getGroupMembershipForUser(this.usernameWithDomain, (err, groups) => {
          if (err) reject(err)
          groups.forEach(element => {
            if (element.cn == "Tartományfelhasználók") {
              this.userGroups[0] = element.cn
            } //kérelmezők AD csoport neve
            if (element.cn == "JogosultsagigenyEngedelyezok") {
              this.userGroups[1] = element.cn
            } //engedélyezők AD csoport neve
            if (element.cn == "JogosultsagigenyAdminisztrator") {
              this.userGroups[2] = element.cn
            } //létrehozók AD csoport neve
            if (element.cn == "JogosultsagigenyTerjesztesilista") {
              this.userGroups[3] = element.cn
            } //terjesztési lista kezelők
          })

          resolve({ username: this.username, userGroups: this.userGroups })
        })
      })
    } catch (err) {
      throw err
    }
  }
}

class Autherization {
  constructor(userGroups) {
    this.userGroups = userGroups
  }

  getAccess(authorizationLevel) {
    let isAuthorized = false //in prod set it false

    this.userGroups.forEach(group => {
      authorizationLevel.forEach(auth => {
        if (group === auth) isAuthorized = true
      })
    })

    return isAuthorized
  }

  isApplicant() {
    return this.getAccess(["JogosultsagigenyAlap", "JogosultsagigenyAdminisztrator"])
  }

  isAuthorizer() {
    return this.getAccess(["JogosultsagigenyEngedelyezok", "JogosultsagigenyAdminisztrator"])
  }

  isAdministrator() {
    return this.getAccess(["JogosultsagigenyAdminisztrator"])
  }

  isAdministratorOrAuthorizer() {
    return this.getAccess(["JogosultsagigenyEngedelyezok", "JogosultsagigenyAdminisztrator"])
  }

  isDistributionlistEditor(){
    return this.getAccess(["JogosultsagigenyTerjesztesilista", "JogosultsagigenyAdminisztrator"])
  }
}

module.exports = { Login, Autherization }

