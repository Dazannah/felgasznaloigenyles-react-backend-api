const { MongoClient } = require("mongodb")

const client = new MongoClient("mongodb://root:root@localhost:27017/")
const arrays = require("../arrays")

const dbFrom = client.db("korhaz-live-copy")
const dbTo = client.db("jogosultsagigenylo")

const requestsFrom = dbFrom.collection("requests")
const requestsTo = dbTo.collection("requests")

async function getRequests() {
  try {
    const result = await requestsFrom.find().toArray()
    return result
  } catch (err) {
    return err
  }
}

async function serializeRequests(requests) {
  //töröltnél mindent kipipált, és nem emelte át a userNames-t
  const serialiezdRequetsValue = requests.map(request => {
    const requestKeys = Object.keys(request)

    let tmp = {
      _id: request._id,
      personalInformations: {
        name: request.name,
        classId: request.dbId,
        className: request.class,
        ticketId: request.id,
        classLeader: request.classLeader,
        workPost: request.post,
        workLocation: request.location,
        validFrom: request.validFrom,
        validTo: request.validTo
      },
      userPermissionsLeft: [],
      userPermissionsMiddle: [],
      userPermissionsRight: [],
      createTextArea: request.request,

      technical: {
        isTechnical: false,
        technicalTextArea: ""
      },
      ticketCreation: {
        userName: request.requestedBy,
        createTime: request.createTime
      },
      process: request.process,
      permission: {
        allowed: request.permission.permission,
        permissionNote: request.permission.permissionNote,
        permissionTime: request.permission.permissionTime,
        authorizedBy: request.permission.authorizedBy
      },
      completed: {
        userName: request.doneBy,
        createTime: request.completionTime
      },
      isCompleted: request.completion == "Kész" ? true : false,
      userId: request.userID,
      userNames: request.userNames
    }

    arrays.leftColumn.forEach(element => {
      let tmpInsert

      if (requestKeys.includes(element.name)) {
        if (request[element.name] != null || undefined) {
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
        if (request[element.name] != null || undefined) {
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
        if (request[element.name] != null || undefined) {
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
  return serialiezdRequetsValue
}

async function main() {
  const legacyRequests = await getRequests()
  const serialiezdRequets = await serializeRequests(legacyRequests)
  const result = await requestsTo.insertMany(serialiezdRequets)

  console.log(result)
  process.exit(0)
}

main()
