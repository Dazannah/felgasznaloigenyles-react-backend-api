const express = require("express")
const router = express.Router()
const loginController = require("./controller/loginController")
const requestController = require("./controller/requestController")
const userController = require("./controller/userController")
const { verifyToken } = require("./controller/loginController")
const utils = require("./utils")
const cors = require("cors")

router.use(cors())

//router.get('/', userController.home)
router.post("/login", loginController.login)
router.post("/get-data", utils.getStartData)

router.get("/validate-token", verifyToken, (req, res) => res.json({ tokenExpired: false }))

router.use(verifyToken)

//requests
router.post("/create-new-ticket", /*userController.igenylok,*/ requestController.createNewUserTicket)

router.get("/requests-list-all", /*loginController.engedejezok,*/ requestController.getAllForPermission)
router.post("/request-update", /*userController.engedejezok,*/ requestController.updateTicketPermission)
router.get("/get-allowed-tickets", /*userController.engedejezok,*/ requestController.getAllowedTickets)
router.get("/get-completed-tickets", /* userController.admin,*/ requestController.completedTickets)
router.post("/close-new-user-ticket", /*userController.admin,*/ requestController.closeNewUserTicket)
router.post("/close-delete-user-request", /*userController.admin,*/ requestController.closeDeleteUserRequest)
router.post("/close-edit-user-request", /*userController.admin,*/ requestController.closeEditUserRequest)
//router.post('/distributinCompleted', userController.mustBeLogedIn, userController.admin, requestController.completedDistributionList)
//router.get('/requestClosed', userController.mustBeLogedIn, userController.adminEngedejezok, requestController.closed)

//
//router.get('/distributionList', userController.mustBeLogedIn, /*userController.igenylok,*/ distributionController.distributionList)
//router.post('/distributionListNew', userController.mustBeLogedIn, /*userController.igenylok,*/ distributionController.distributionListNew)

//user
router.get("/list-users", /*userController.igenylok,*/ userController.listUsers)
router.post("/user/:id/delete", /*userController.igenylok,*/ userController.requestDeleteUser)
router.get("/user/:id/edit", /*userController.igenylok,*/ userController.requestEditUser)
router.post("/user/:id/edit", /*userController.igenylok,*/ requestController.saveEditRequest)
router.get("/user/:id/requests", requestController.getRequestsForUser)

module.exports = router
