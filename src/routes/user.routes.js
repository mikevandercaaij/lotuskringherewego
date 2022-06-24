const express = require("express");
const userController = require("./../controllers/user.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

const { loadPendingRequests } = require("./../controllers/auth.controller");

router.post("/user/roles", isLoggedIn, loadPendingRequests, userController.changeRoles);

router.post("/user/roles/switch", isLoggedIn, loadPendingRequests, userController.switchActiveRole);

router.post("/user/create", isLoggedIn, loadPendingRequests, userController.createMember);

router.post("/user/create/notify", isLoggedIn, loadPendingRequests, userController.notifyInvitedMember);

router.get("/user/profile", isLoggedIn, loadPendingRequests, userController.getUserProfile);

router.post("/user/profile/edit", isLoggedIn, loadPendingRequests, userController.changeUserProfileDetails);

router.post("/user/profile/password", isLoggedIn, loadPendingRequests, userController.changePassword);

router.post("/user/profile/roles", isLoggedIn, loadPendingRequests, userController.requestRole);

router.post("/user/profile/roles/cancel", isLoggedIn, loadPendingRequests, userController.cancelRequestRole);

router.post("/user/delete/member", isLoggedIn, loadPendingRequests, userController.deleteMember);

module.exports = router;
