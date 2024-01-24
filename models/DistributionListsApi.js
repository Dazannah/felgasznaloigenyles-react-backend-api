const dotenv = require("dotenv")
dotenv.config()
const { CloseNewDistributionList } = require("../models/DistributionList")

const phpCommand = process.env.PHPCOMMAND || ""

const fs = require("fs")
const exec = require("child_process").exec;


class DistributionListsApi{
    createDisributionList(username, distributionListAddres, addresses, res){
        const timestamp = Date.now()
        const fileName = `./json/tempCreateDistributionlist-${username}-${timestamp}.json`
        const data = JSON.stringify({
            distributionListAddres,
            addresses
        })

        fs.writeFileSync(fileName, data)

        exec(`${phpCommand}php ./php/createDisributionList.php ${fileName}`, async (error, stdout, stderr) =>{
            if(error) {
                res.json(error)
                console.log(error)
                return
            }

            if(stdout) {
                if(stdout == "sucess"){
                    const closeNewDistributionList = new CloseNewDistributionList(distributionListAddres, addresses, username)
                    await closeNewDistributionList.save()

                    //create and close distribution list here
                    res.json("done")
                    console.log("done")
                    return
                }else{
                    res.json({errors: stdout})
                    console.log("failed")
                    return
                }
            }

            if(stderr) {
                res.json(stderr)
                console.log(stderr)
                return
            }
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

    async getDistributionLists(res, accessor = false, value = false){
        let users = []
        let toDelete = []

        if(accessor === "" || value === ""){
            accessor = false
            value = false
        }

        exec(`${phpCommand}php ./php/getDistributionLists.php ${accessor} ${value}`, async (error, stdout, stderr) =>{
            if(error) console.log(error)
            if(stdout) {
                const jsonStringBuffer = fs.readFileSync("./json/tempGetDistributionlists.json")
                users = JSON.parse(jsonStringBuffer)

                users.forEach((user, index) => {
                    delete user.password

                    user.emailRedirects = []
                    user.specialFilter = false

                    if(!/if /.test(user.custom_mailfilter)) {
                        const emailsStrings = user.custom_mailfilter.split(";")

                        emailsStrings.forEach(emailString =>{
                            emailString = emailString.substring(emailString.indexOf('"') + 1, emailString.lastIndexOf('"'))
                            if(emailString !== "") user.emailRedirects.push(emailString)
                        })

                        user.emailsCount = user.emailRedirects.length
                    }else{
                        user.emailRedirects = user.custom_mailfilter
                        user.emailsCount = 1
                        user.specialFilter = true
                    }

                    if(accessor === "emailsCount" && user.emailsCount != value){
                        toDelete.push(index)
                    }
                })

                toDelete.forEach((number, index) =>{
                    users.splice(number - index, 1)
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