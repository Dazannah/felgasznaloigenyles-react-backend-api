const dotenv = require("dotenv")
dotenv.config()

const phpCommand = process.env.PHPCOMMAND || ""

const fs = require("fs")
const exec = require("child_process").exec;


class DistributionListsApi{
    createDisributionList(){
        const timestamp = Date.now()
        const username = "teszt.elek"
        const fileName = `./json/tempCreateDistributionlist-${username}-${timestamp}.json`
        const data = JSON.stringify({
            distributionListAddres: "apiteszt",
            adresses: ["fabian.david@infolankft.hu"]
        })

        fs.writeFileSync(fileName, data)

        exec(`${phpCommand}php ./php/createDisributionList.php ${fileName}`, (error, stdout, stderr) =>{
            if(error) console.log(error)
            if(stdout) {
                if(stdout == "sucess"){
                    console.log("done")
                }else{
                    console.log("failed")
                }
            }

            if(stderr) console.log(stderr)
        })
    }

    deleteDistributionList(){
        const username = "apiteszt"

        exec(`${phpCommand}php ./php/deleteDisributionList.php ${username}`, (error, stdout, stderr) =>{

            if(error) console.log(error)
            if(stdout) {
                if(stdout) {
                    if(stdout == "sucess"){
                        console.log("done")
                    }else{
                        console.log("failed")
                    }
                }
            }

            if(stderr) console.log(stderr)
        })
    }

    async getDistributionLists(res){
        let users

        exec(`${phpCommand}php ./php/getDistributionLists.php`, async (error, stdout, stderr) =>{
            if(error) console.log(error)
            if(stdout) {
                const jsonStringBuffer = fs.readFileSync("./json/tempGetDistributionlists.json")
                users = JSON.parse(jsonStringBuffer)

                users.forEach(user => {
                    delete user.password

                    user.emailRedirects = []
                    user.specialFilter = false

                    if(!/if /.test(user.custom_mailfilter)) {
                        const emailsStrings = user.custom_mailfilter.split(";")

                        emailsStrings.forEach(emailString =>{
                            emailString = emailString.substring(emailString.indexOf('"') + 1, emailString.lastIndexOf('"'))
                            if(emailString !== "") user.emailRedirects.push(emailString)
                        })
                    }else{
                        user.emailRedirects = user.custom_mailfilter
                        user.specialFilter = true
                    }
                })
            }

            if(stderr) console.log(stderr)

            res.json(users)
        })

    }

    updateDistributionList(){
        const timestamp = Date.now()
        const username = "teszt.elek"
        const fileName = `./json/tempUpdateDistributionlist-${username}-${timestamp}.json`
        const data = JSON.stringify({
            distributionListAddres: "apiteszt",
            adresses: ["teszt1@hmek.hu", "fabian.david@infolankft.hu"]
        })

        fs.writeFileSync(fileName, data)

        exec(`${phpCommand}php ./php/updateDistributionList.php ${fileName}`, (error, stdout, stderr) =>{

            if(error) console.log(error)
            if(stdout) {
                if(stdout === "sucess"){
                    console.log("done")
                }else{
                    console.log("fail")
                }
            }

            if(stderr) console.log(stderr)
        })
    }
}

module.exports = DistributionListsApi