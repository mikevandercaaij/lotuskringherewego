const express = require("express");
const requestController = require("../controllers/request.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

const { loadPendingRequests } = require("./../controllers/auth.controller");

router.get("/request", isLoggedIn, loadPendingRequests, requestController.getAllRequests);

router.post("/request/approve", isLoggedIn, loadPendingRequests, requestController.approveRequest);

router.post("/request/decline", isLoggedIn, loadPendingRequests, requestController.declineRequest);

module.exports = router;
