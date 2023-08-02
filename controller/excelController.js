const { GetAllUserExcel } = require("../models/Excel")

async function getUserExcel(req, res, next){
    try{
        const getAllUserExcel = new GetAllUserExcel(res)
        await getAllUserExcel.getDataForExcel()
        await getAllUserExcel.addHeaderToExCell()
        await getAllUserExcel.sendExcel()

        //res.status(200).json("ok")
    }catch(err){
        res.json(err)
    }
}

module.exports ={
    getUserExcel
}