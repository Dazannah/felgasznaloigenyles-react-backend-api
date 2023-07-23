class Cookies {
  constructor(_rawCookies) {
    this.rawCookies = _rawCookies
  }

  getCookieObj() {
    if (this.rawCookies) {
      const splittedCookies = this.rawCookies.split(";")
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
      return "No cookies for you."
    }
  }
}

module.exports = Cookies
