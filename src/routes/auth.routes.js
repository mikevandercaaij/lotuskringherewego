const express = require("express");
const authController = require("./../controllers/auth.controller");
const userController = require("./../controllers/user.controller");
const router = express.Router();

router.get("/login", authController.getLoginPage);

router.post("/login", authController.login);

router.get("/logout", authController.isLoggedIn, authController.logout);

router.get("/register", authController.getRegisterPage);

router.post("/register", userController.createUser);

router.get("/register/setup", authController.getSetupPage);

router.post("/register/setup", authController.setupMember);

router.get("/user/forgot/password", authController.getForgotPasswordPage);

router.post("/user/forgot/password", authController.sendRecoveryMail);

router.get("/user/forgot/password/reset", authController.getResetPasswordPage);

router.post("/user/forgot/password/reset", authController.resetPassword);

module.exports = router;
