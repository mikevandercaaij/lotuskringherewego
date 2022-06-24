const mongoose = require("../../database/dbconnection");
const Request = require("../models/request.model");
const { assignmentModel } = require("../models/assignment.model");
const Assignment = assignmentModel;
const { userModel } = require("../models/user.model");
const { notifyUserThroughMail, sendPDFMail } = require("../controllers/mail.controller");
const User = userModel;
const { buildPDF } = require("../services/pdf-service");

exports.createRequest = async (req, res, objectId, type) => {
    // Get session
    const session = req.session;
    // Create request
    const request = new Request({
        userId: session.user.userId,
        assignmentId: objectId.toString(),
        type: type,
    });
    // Save request
    request.save();
    // Return request
    return request;
};

exports.getAllRequests = async (req, res) => {
    let alertText = "";
    if (req.query.declinedRequest) {
        alertText = "Aanvraag afgewezen!";
    } else if (req.query.approvedRequest) {
        alertText = "Aanvraag goedgekeurd!"
    } 
    const requests = await Request.find({ status: "In behandeling" });
    const parsedRequests = await parseRequest(requests);
    return res.render("request_overview", { pageName: "Verzoeken", session: req.session, requests: parsedRequests, alertText });
};

async function parseRequest(results) {
    let parsedRequests = [];

    for (let result of results) {
        const user = await User.find({ _id: result.userId });
        const assignment = await Assignment.find({ _id: result.assignmentId });
        const participations = await Request.find({ userId: result.userId, type: "enrollment", status: "Openstaand" }).exec();
        const canceledParticipations = await Request.find({ userId: result.userId, type: "cancelEnrollment", status: "Openstaand" }).exec();

        user[0].participations = participations.length - canceledParticipations.length;

        result = {
            ...result._doc,
            user: user[0],
            assignment: assignment[0],
        };

        parsedRequests.push(result);
    }

    return parsedRequests;
}

exports.approveRequest = async (req, res) => {
    const { requestType, requestId, assignmentId, userId } = req.body;

    let userData = await User.find({ _id: userId });
    userData = userData[0];

    if (requestType === "createAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $set: { isApproved: true } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Openstaand" } });
        res.redirect("/request?approvedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "approvedCreateAssignment", "Aanvraag opdracht aanmaken goedgekeurd");

        if (sendStatus) {
            console.log("Client notified (Approved assignment create)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "addClientRole") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await User.findOneAndUpdate({ _id: userId }, { $push: { roles: "client" } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        res.redirect("/request");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "approvedAddClientRole", "Aanvraag om opdrachtgever te worden goedgekeurd");

        if (sendStatus) {
            console.log("Client notified (Approved client role)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "updateAssignment") {
        const { firstName, lastName, emailAddress, street, houseNumber, houseNumberAddition, postalCode, town, billingEmailAddress, dateTime, playgroundStreet, playgroundHouseNumber, playgroundHouseNumberAddition, playgroundPostalCode, playgroundTown, makeUpStreet, makeUpHouseNumber, makeUpHouseNumberAddition, makeUpPostalCode, makeUpTown, amountOfLotusVictims, comments } = req.body;

        const updatedAssignment = {
            firstName,
            lastName,
            emailAddress,
            street,
            houseNumber,
            houseNumberAddition,
            postalCode,
            town,
            billingEmailAddress,
            dateTime,
            playgroundStreet,
            playgroundHouseNumber,
            playgroundHouseNumberAddition,
            playgroundPostalCode,
            playgroundTown,
            makeUpStreet,
            makeUpHouseNumber,
            makeUpHouseNumberAddition,
            makeUpPostalCode,
            makeUpTown,
            amountOfLotusVictims,
            comments,
        };
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $set: { ...updatedAssignment } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Openstaand" } });
        res.redirect("/request?approvedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "approvedUpdateAssignment", "Aanvraag opdracht wijzigen goedgekeurd");

        if (sendStatus) {
            console.log("Client notified (Approved assignment update)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "deleteAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.deleteOne({ _id: assignmentId });
        await Request.deleteMany({ assignmentId: assignmentId });
        res.redirect("/request?approvedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "approvedDeleteAssignment", "Aanvraag opdracht verwijderen goedgekeurd");

        if (sendStatus) {
            console.log("Client notified (Approved assignment delete)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "enrollment") {
        let user = await User.find({ _id: userId });
        user = user[0];

        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $push: { participatingLotusVictims: user } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        let assignment = await Assignment.find({ _id: assignmentId });
        assignment = assignment[0];

        if (assignment.participatingLotusVictims.length === assignment.amountOfLotusVictims) {
            await Request.findOneAndUpdate({ assignmentId: assignmentId, type: "createAssignment" }, { $set: { status: "Compleet" } });

            res.redirect("/request?approvedRequest=true");

            for await (let victim of assignment.participatingLotusVictims) {
                const pdf = await buildPDF(undefined, undefined, assignment);
                await sendPDFMail(pdf, victim, assignment);
            }
        } else {
            await Request.findOneAndUpdate({ assignmentId: assignmentId, type: "createAssignment" }, { $set: { status: "Openstaand" } });

            res.redirect("/request?approvedRequest=true");
        }
      
        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "approvedEnrollment", "Inschrijving goedgekeurd");

        if (sendStatus) {
            console.log("Client notified (Approved enrollment)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "cancelEnrollment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.updateOne({ _id: assignmentId }, { $pull: { participatingLotusVictims: { _id: userId } } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });

        let assignment = await Assignment.find({ _id: assignmentId });
        assignment = assignment[0];

        if (assignment.participatingLotusVictims.length === assignment.amountOfLotusVictims) {
            await Request.findOneAndUpdate({ assignmentId: assignmentId, type: "createAssignment" }, { $set: { status: "Compleet" } });

            res.redirect("/request?approvedRequest=true");

            for await (let victim of assignment.participatingLotusVictims) {
                const pdf = await buildPDF(undefined, undefined, assignment);
                await sendPDFMail(pdf, victim, assignment);
            }
        } else {
            await Request.findOneAndUpdate({ assignmentId: assignmentId, type: "createAssignment" }, { $set: { status: "Openstaand" } });

            res.redirect("/request?approvedRequest=true");
        }

        await Request.deleteMany({ assignmentId: assignmentId, userId: userId, type: "enrollment", status: "Goedgekeurd" });
        await Request.deleteMany({ assignmentId: assignmentId, userId: userId, type: "cancelEnrollment", status: "Goedgekeurd" });

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "approvedCancelEnrollment", "Uitschrijving goedgekeurd");

        if (sendStatus) {
            console.log("Client notified (Approved cancel enrollment)");
        } else {
            console.log("Email not send");
        }
    }
};

exports.declineRequest = async (req, res) => {
    const { requestType, requestId, assignmentId, userId } = req.body;

    let userData = await User.find({ _id: userId });
    userData = userData[0];

    if (requestType === "createAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });

        res.redirect("/request?declinedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "deniedCreateAssignment", "Aanvraag opdracht aanmaken afgewezen");

        if (sendStatus) {
            console.log("Client notified (Denied assignment create)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "addClientRole") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });

        res.redirect("/request");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "deniedAddClientRole", "Aanvraag om opdrachtgever te worden afgewezen");

        if (sendStatus) {
            console.log("Client notified (Denied client role)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "updateAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "updateAssignment", status: "Afgewezen" });
        res.redirect("/request?declinedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "deniedUpdateAssignment", "Aanvraag opdracht wijzigen afgewezen");

        if (sendStatus) {
            console.log("Client notified (Denied assignment update)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "deleteAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "deleteAssignment", status: "Afgewezen" });
        res.redirect("/request?declinedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "deniedDeleteAssignment", "Aanvraag opdracht verwijderen afgewezen");

        if (sendStatus) {
            console.log("Client notified (Denied assignment delete)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "enrollment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        res.redirect("/request?declinedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "deniedEnrollment", "Inschrijving afgewezen");

        if (sendStatus) {
            console.log("Client notified (Denied enrollment)");
        } else {
            console.log("Email not send");
        }
    }

    if (requestType === "cancelEnrollment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "cancelEnrollment", status: "Afgewezen" });
        res.redirect("/request?declinedRequest=true");

        const sendStatus = await notifyUserThroughMail(userData.emailAddress, userData.firstName, "deniedCancelEnrollment", "Uitschrijving afgewezen");

        if (sendStatus) {
            console.log("Client notified (Denied cancel enrollment)");
        } else {
            console.log("Email not send");
        }
    }
};
