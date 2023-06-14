const express = require("express")
const router = express.Router()
const loginController = require("./controller/loginController")
const requestController = require("./controller/requestController")
const { verifyToken } = require("./controller/loginController")
const utils = require("./utils")
const cors = require("cors")

router.use(cors())

//router.get('/', userController.home)
router.post("/login", loginController.login)
router.post("/get-data", utils.getStartData)

router.post("/validate-token", verifyToken, (req, res) => res.json({ tokenExpired: false }))

router.use(verifyToken)
//router.get('/home', userController.mustBeLogedIn, /*userController.igenylok,*/ requestController.newForm)

//requests
router.post("/create-new-ticket", /*userController.igenylok,*/ requestController.createNewUserTicket)

router.post("/requests-list-all", /*loginController.engedejezok,*/ requestController.getAllRequest)
router.post("/request-update", /*userController.mustBeLogedIn, userController.engedejezok,*/ requestController.updateTicketPermission)
//router.post('/distributionListUpdate', userController.mustBeLogedIn, userController.engedejezok, requestController.updateDistributionList)
//router.get('/requestsHandle', userController.mustBeLogedIn, userController.admin, requestController.getRequestsHandle)
//router.post('/requestCompleted', userController.mustBeLogedIn, userController.admin, requestController.completed)
//router.post('/distributinCompleted', userController.mustBeLogedIn, userController.admin, requestController.completedDistributionList)
//router.get('/requestClosed', userController.mustBeLogedIn, userController.adminEngedejezok, requestController.closed)

//
//router.get('/distributionList', userController.mustBeLogedIn, /*userController.igenylok,*/ distributionController.distributionList)
//router.post('/distributionListNew', userController.mustBeLogedIn, /*userController.igenylok,*/ distributionController.distributionListNew)

//user
//router.get('/listUsers', userController.mustBeLogedIn, /*userController.igenylok,*/ getUserController.listUsers)
//router.get('/user/:id', userController.mustBeLogedIn, /*userController.igenylok,*/ getUserController.listSingleUser)
//router.post('/user/:id/delete', userController.mustBeLogedIn, /*userController.igenylok,*/ getUserController.requestDeleteUser)
//router.get('/user/:id/edit', userController.mustBeLogedIn, /*userController.igenylok,*/ getUserController.requestEditUser)
//router.post('/user/:id/edit', userController.mustBeLogedIn, /*userController.igenylok,*/ getUserController.saveEdit)

//router.get('/error', userController.mustBeLogedIn, userController.errorSite)

//logOut
//router.post('/logOut',  userController.mustBeLogedIn, userController.logOut)

module.exports = router
