const { getAllValidMembers, getAllValidClients, getAllInvitedMembers } = require("./../controllers/user.controller");
const { assignmentModel } = require("../models/assignment.model");
const { userModel } = require("./../models/user.model");
const Request = require("../models/request.model");
const Assignment = assignmentModel;
const User = userModel;

exports.getHomepage = (req, res) => {
    if (req.session.user.activeRole == "coordinator" || req.session.user.activeRole == "member") {
        let usersFilteredAmount = 0;

        Assignment.find({ isApproved: true }, async function (err, assignments) {
            if (req.session.user.activeRole == "coordinator") {
                Request.find({ status: "In behandeling" }, function (err, requests) {
                    User.find(async function (err, users) {
                        users.forEach((user) => {
                            if (user.activeRole == "client" || user.activeRole == "member") {
                                usersFilteredAmount++;
                            }
                        });

                        let my_assignments_amount = 0;
                        await assignments.forEach((assignment) => {
                            assignment.participatingLotusVictims.forEach((victim) => {
                                if (victim.emailAddress == req.session.user.emailAddress) {
                                    my_assignments_amount++;
                                }
                            });
                        });

                        let open_assignments_amount = assignments.length - my_assignments_amount;

                        res.render("dashboard", { pageName: "Dashboard", session: req.session, assignments_amount: open_assignments_amount, request_amount: requests.length, users_amount: usersFilteredAmount });
                    });
                });
            } else if (req.session.user.activeRole == "member") {
                let my_assignments_amount = 0;
                for await (let assignment of assignments) {
                    for await (let victim of assignment.participatingLotusVictims) {
                        if (victim.emailAddress == req.session.user.emailAddress) {
                            my_assignments_amount++;
                        }
                    }
                }

                let open_assignments_amount = 0;
                for await (let assignment of assignments) {
                    if (assignment.participatingLotusVictims.length != assignment.amountOfLotusVictims) {
                        let enrolledInAssignment = false;
                        for await (let victim of assignment.participatingLotusVictims) {
                            if (victim.emailAddress == req.session.user.emailAddress) {
                                enrolledInAssignment = true;
                            }
                        }
                        if (!enrolledInAssignment) {
                            const deniedEnrollments = await Request.find({ userId: req.session.user.userId, assignmentId: assignment._id, status: "Afgewezen", type: "enrollment" });
                            if (deniedEnrollments.length == 0) {
                                open_assignments_amount++;
                            }
                        }
                    }
                }

                res.render("dashboard", { pageName: "Dashboard", session: req.session, open_assignments_amount: open_assignments_amount, my_assignments_amount: my_assignments_amount });
            }
        });
    } else if (req.session.user.activeRole == "client") {
        Assignment.find(function (err, assignments) {
            let assignments_amount_approved = 0;
            let assignments_amount_not_approved = 0;

            assignments.forEach((assignment) => {
                if (assignment.emailAddress == req.session.user.emailAddress && assignment.isApproved == true) {
                    assignments_amount_approved++;
                } else if (assignment.emailAddress == req.session.user.emailAddress && assignment.isApproved == false) {
                    assignments_amount_not_approved++;
                }
            });

            res.render("dashboard", { pageName: "Dashboard", session: req.session, assignments_amount_approved, assignments_amount_not_approved });
        });
    }
};

exports.getUserOverview = (req, res) => {
    (async () => {
        let alertText = "";

        if (req.query.invitedMember) {
            alertText = "Lid is succesvol uitgenodigd!";
        } else if (req.query.remindedMember) {
            alertText = "Herinnering verstuurd!";
        } else if (req.query.deleteMember) {
            alertText = "Lid is succesvol verwijderd!";
        }

        const allMembers = await getAllValidMembers();
        const allClients = await getAllValidClients();
        const allInvitedMembers = await getAllInvitedMembers();
        return res.render("user_overview", { pageName: "Gebruikers", session: req.session, allMembers, allClients, allInvitedMembers, alertText });
    })();
};
