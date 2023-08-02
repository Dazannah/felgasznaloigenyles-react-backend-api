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
            this.headers.push(element.id)
        })

        arrays.leftColumn.forEach(element =>{
            headerNames.push(element.value)
            this.headers.push(element.id)
        })

        arrays.middleColumn.forEach(element =>{
            headerNames.push(element.value)
            this.headers.push(element.id)
        })

        arrays.rightColumn.forEach(element =>{
            headerNames.push(element.value)
            this.headers.push(element.id)
        })

        headerNames.forEach((name, index) =>{
            this.activeWs.cell(1, index + 2).string(name)
        })

        headerNames.forEach((name, index) =>{
            this.deletedWs.cell(1, index + 2).string(name)
        })
    }

    /*addDataToExcel(){
        this.activeUsers.forEach((user, index)=>{

            this.activeWs.cell(2, index + 1).string(name)
        })
        //this.deletedUsers
        //this.activeWs.cell(1, index + 1).string(name)
    }*/



    async sendExcel(){
        this.wb.write('ExcelFile.xlsx', this.res)
    }
}

module.exports ={
    Excel,
    GetAllUserExcel
}