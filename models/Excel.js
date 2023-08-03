const xls = require('excel4node')
const {GetData} = require("../models/Database")
const arrays = require("../arrays")

class Excel{
    constructor(){
        this.wb = new xls.Workbook()
        this.error =[]
        this.data = []
    }


}

class GetAllUserExcel extends Excel{
    constructor(res){
        super()
        this.res = res
        this.activeWs = this.wb.addWorksheet('Aktív')
        this.deletedWs = this.wb.addWorksheet('Törölt')
        this.headers = []
    }

    async getDataForExcel(){
        const getActiveUsers = new GetData({collection: "users"})
        const getDeletedUsers = new GetData({collection: "deletedUsers"})

        this.activeUsers = await getActiveUsers.getAllFromCollection()
        this.deletedUsers = await getDeletedUsers.getAllFromCollection()
    }

    async addHeaderToExCell(){
        const headerNames = []

        arrays.upperFields.forEach(element =>{
            headerNames.push(element.value)
            if(element.id === "isTechnical"){
                this.headers.push({name: element.id, route: "technical", subRoute: "isTechnical"})
            }else{
                this.headers.push({name: element.id, route: `personalInformations`, subRoute: `${element.subRoute}`})
            }
        })

        arrays.leftColumn.forEach(element =>{
            headerNames.push(element.value)
            this.headers.push({name: element.id, route: `userNames`, subRoute: `${element.id}`})
        })

        arrays.middleColumn.forEach((element, index) =>{
            headerNames.push(element.value)
            this.headers.push({name: element.id, route: `userPermissionsMiddle`, subRoute: index})
        })

        arrays.rightColumn.forEach((element, index) =>{
            headerNames.push(element.value)
            this.headers.push({name: element.id, route: `userPermissionsRight`, subRoute: index})
        })

        headerNames.forEach((name, index) =>{
            this.activeWs.cell(1, index + 2).string(name)
        })

        headerNames.forEach((name, index) =>{
            this.deletedWs.cell(1, index + 2).string(name)
        })
    }

    addDataToExcel(){
        this.helperGenerate(this.activeUsers, this.activeWs)
        this.helperGenerate(this.deletedUsers, this.deletedWs)
    }

    helperGenerate(usersArray, workSheet){
        usersArray.forEach((user, index)=>{
            workSheet.cell(index + 2, 1).number(index + 1)

            this.headers.forEach((element, elementIndex) =>{
                let value
                if(!user[element.route][element.subRoute]){
                    if(element.subRoute === "isTechnical"){
                        let technicalTmp = "Nem"
                        if(user[element.route][element.subRoute]) tmp = "Igen"
                        value = technicalTmp
                    }else{
                        value = ""
                    }
                }else{
                    if(Number.isInteger(element.subRoute)){
                        let tmp = "Nem"
                        if(user[element.route][element.subRoute].value) tmp = "Igen"
                        value = tmp
                    }else{
                        value = user[element.route][element.subRoute]
                    }
                }
                workSheet.cell(index + 2, elementIndex + 2).string(value)
            })
        })
    }


    async sendExcel(){
        this.wb.write('Felhasználók.xlsx', this.res)
    }
}

module.exports ={
    Excel,
    GetAllUserExcel
}