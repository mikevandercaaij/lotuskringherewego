const express = require("express");
const homeController = require("./../controllers/home.controller");
const { isLoggedIn, isCoordinator } = require("./../controllers/auth.controller");
const router = express.Router();

const { loadPendingRequests } = require("./../controllers/auth.controller");

router.get("/", isLoggedIn, loadPendingRequests, homeController.getHomepage);

router.get("/user", isLoggedIn, isCoordinator, loadPendingRequests, homeController.getUserOverview);

module.exports = router;
