const express = require("express");
const assignmentController = require("../controllers/assignment.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

const { loadPendingRequests } = require("./../controllers/auth.controller");

router.get("/assignment/create", isLoggedIn, loadPendingRequests, assignmentController.getAssignmentPage);

router.get("/assignment/update", isLoggedIn, loadPendingRequests, assignmentController.getAssignmentUpdatePage);

router.get("/assignment", isLoggedIn, loadPendingRequests, assignmentController.getAllAssignments);

router.get("/member/assignment", isLoggedIn, loadPendingRequests, assignmentController.getMemberAssignments);

router.post("/assignment", isLoggedIn, loadPendingRequests, assignmentController.createAssignment);

router.post("/assignment/update", isLoggedIn, loadPendingRequests, assignmentController.updateAssignment);

router.post("/assignment/delete", isLoggedIn, loadPendingRequests, assignmentController.deleteAssignment);

router.get("/assignment/detail", isLoggedIn, loadPendingRequests, assignmentController.getAssignmentDetailPage);

router.post("/assignment/enroll", isLoggedIn, assignmentController.enrollAssignment);

router.post("/assignment/cancel", isLoggedIn, assignmentController.cancelEnrollment);

router.post("/assignment/member/delete", isLoggedIn, loadPendingRequests, assignmentController.deleteMemberFromAssignment);

router.get("/member/assignment/pdf", isLoggedIn, loadPendingRequests, assignmentController.sendPDFdata);

module.exports = router;
