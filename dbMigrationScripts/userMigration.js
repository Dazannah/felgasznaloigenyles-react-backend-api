const { MongoClient } = require("mongodb")

const client = new MongoClient("mongodb://root:root@localhost:27017/")
const arrays = require("../arrays")

const dbFrom = client.db("korhaz-live-copy")
const dbTo = client.db("jogosultsagigenylo")

const usersFrom = dbFrom.collection("users")
const usersTo = dbTo.collection("users")

function serializeUsers(legacyUsers) {
  const serializedUsers = legacyUsers.map(user => {
    const requestKeys = Object.keys(user.userPermissions)
    const usernamesKey = Object.keys(user.usernames)

    let tmp = {
      _id: user._id,
      userNames: user.usernames,
      personalInformations: {
        name: user.name,
        classId: user.dbId,
        className: user.class,
        classLeader: user.classLeader,
        workPost: user.post,
        workLocation: user.location,
        validFrom: user.validFrom,
        validTo: user.validTo
      },
      userPermissionsLeft: [],
      userPermissionsMiddle: [],
      userPermissionsRight: [],
      technical: {
        isTechnical: false,
        technicalTextArea: ""
      },
      status: user.status
    }

    arrays.leftColumn.forEach(element => {
      let tmpInsert

      if (usernamesKey.includes(element.name)) {
        if (user.usernames[element.name] != null || undefined) {
          tmpInsert = { name: `${element.name}`, value: true }
        } else {
          tmpInsert = { name: `${element.name}`, value: false }
        }
      } else {
        tmpInsert = { name: `${element.name}`, value: false }
      }
      tmp.userPermissionsLeft.push(tmpInsert)
    })

    arrays.middleColumn.forEach(element => {
      let tmpInsert

      if (requestKeys.includes(element.name)) {
        if (user.userPermissions[element.name] != null || undefined) {
          tmpInsert = { name: `${element.name}`, value: true }
        } else {
          tmpInsert = { name: `${element.name}`, value: false }
        }
      } else {
        tmpInsert = { name: `${element.name}`, value: false }
      }
      tmp.userPermissionsMiddle.push(tmpInsert)
    })

    arrays.rightColumn.forEach(element => {
      let tmpInsert

      if (requestKeys.includes(element.name)) {
        if (user.userPermissions[element.name] != null || undefined) {
          tmpInsert = { name: `${element.name}`, value: true }
        } else {
          tmpInsert = { name: `${element.name}`, value: false }
        }
      } else {
        tmpInsert = { name: `${element.name}`, value: false }
      }
      tmp.userPermissionsRight.push(tmpInsert)
    })

    return tmp
  })

  return serializedUsers
}

async function main() {
  const legacyUsers = await usersFrom.find().toArray()
  const serializedUsers = serializeUsers(legacyUsers)
  const result = await usersTo.insertMany(serializedUsers)

  console.log(result)
  process.exit(0)
}

main()
