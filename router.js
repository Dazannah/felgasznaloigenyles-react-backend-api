const express = require("express")
const router = express.Router()
const loginController = require("./controller/loginController")
const requestController = require("./controller/requestController")
const userController = require("./controller/userController")
const distributionListController = require("./controller/distributionListController")
const searchController = require("./controller/searchController")
const excelController = require("./controller/excelController")
const { verifyToken } = require("./controller/loginController")
const utils = require("./utils")
const cors = require("cors")

router.use(cors())

router.post("/login", loginController.login)
router.post("/get-data", utils.getStartData)

router.get("/validate-token", verifyToken, (req, res) => res.json({ tokenExpired: false }))

router.use(verifyToken)

//requests
router.post("/create-new-ticket", /*loginController.applicants,*/ requestController.createNewUserTicket)

router.get("/requests-list-all", loginController.authorizers, requestController.getAllForPermission)
router.post("/request-update", loginController.authorizers, requestController.updateTicketPermission)
router.get("/get-allowed-tickets", loginController.administrators, requestController.getAllowedTickets)
router.get("/get-completed-tickets", loginController.administratorsAndAuthorizers, requestController.completedTickets)
router.post("/close-new-user-ticket", loginController.administrators, requestController.closeNewUserTicket)
router.post("/close-delete-user-request", loginController.administrators, requestController.closeDeleteUserRequest)
router.post("/close-edit-user-request", loginController.administrators, requestController.closeEditUserRequest)

router.post("/update-user-request",  loginController.administrators, requestController.updateRequest)

//distributin lists
router.get("/get-distribution-lists", /* loginController.applicants,*/ distributionListController.getDistributionLists)
router.post("/create-new-distribution-list", /*loginController.applicants,*/ distributionListController.createNewDistributionList)
router.post("/close-distribution-list-create-request", /*loginController.administrators,*/ distributionListController.closeCreateDistributionList)

//table head search
router.post("/table-head-search", /*loginController.applicants,*/ searchController.tableHeadSearch)

//user
router.get("/list-active-users", /*loginController.applicants,*/ userController.listUsers)
router.get("/list-deleted-users", /*loginController.applicants,*/ userController.listDeletedUsers)
router.post("/user/:id/delete", /*loginController.applicants,*/ userController.requestDeleteUser)
router.get("/user/:id/edit", /*loginController.applicants,*/ userController.requestEditUser)
router.post("/user/:id/edit", /*loginController.applicants,*/ requestController.saveEditRequest)
router.get("/user/:id/requests", requestController.getRequestsForUser)

//excell
router.get("/excel-get-all-user", excelController.getUserExcel)

module.exports = router
