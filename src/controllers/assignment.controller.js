const mongoose = require("../../database/dbconnection");
const { assignmentModel } = require("../models/assignment.model");
const { userModel } = require("../models/user.model");
const Request = require("../models/request.model");
const { createRequest } = require("./request.controller");
const pdfService = require("../services/pdf-service");
const { phone } = require("phone");
const { notifyUserThroughMail, notifyCoordinatorRequest } = require("./mail.controller");

const Assignment = assignmentModel;
const User = userModel;

// Functionality for creating an assignment
exports.createAssignment = (req, res) => {
    // Get session
    const session = req.session;
    // Declare all variables out of req.body
    const { firstName, lastName, emailAddress, street, houseNumber, phoneNumber, houseNumberAddition, postalCode, town, billingEmailAddress, dateTime, endTime, playgroundStreet, playgroundHouseNumber, playgroundHouseNumberAddition, playgroundPostalCode, playgroundTown, makeUpStreet, makeUpHouseNumber, makeUpHouseNumberAddition, makeUpPostalCode, makeUpTown, amountOfLotusVictims, comments, isApproved, requestId, checkedOrNotProfile, checkedOrNotPlayground, checkedOrNotMakeUp } = req.body;
    // Create new assignment object
    const assignment = new Assignment({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        street: street,
        houseNumber: houseNumber,
        houseNumberAddition: houseNumberAddition,
        postalCode: postalCode,
        town: town,
        billingEmailAddress: billingEmailAddress,
        dateTime: dateTime,
        endTime: endTime,
        playgroundStreet: playgroundStreet,
        playgroundHouseNumber: playgroundHouseNumber,
        playgroundHouseNumberAddition: playgroundHouseNumberAddition,
        playgroundPostalCode: playgroundPostalCode,
        playgroundTown: playgroundTown,
        makeUpStreet: makeUpStreet,
        makeUpHouseNumber: makeUpHouseNumber,
        makeUpHouseNumberAddition: makeUpHouseNumberAddition,
        makeUpPostalCode: makeUpPostalCode,
        makeUpTown: makeUpTown,
        amountOfLotusVictims: amountOfLotusVictims,
        comments: comments,
        isApproved: isApproved,
        requestId: requestId,
    });
    // Check if coordinator is trying to make an assignment
    if (session.user.activeRole === "coordinator") {
        assignment.isApproved = true;
    }
    // Save assignment object in database and show errors if they exists
    assignment.save(function (err, savedAssignment) {
        if (err) {
            const errors = {};
            const oldValues = {};
            errors.oldValues = oldValues;

            if (typeof err.errors.firstName != "undefined") {
                errors.firstNameErr = err.errors.firstName.properties.message;
            } else {
                errors.oldValues.firstName = req.body.firstName;
            }

            if (typeof err.errors.lastName != "undefined") {
                errors.lastNameErr = err.errors.lastName.properties.message;
            } else {
                errors.oldValues.lastName = req.body.lastName;
            }

            if (typeof err.errors.emailAddress != "undefined") {
                errors.emailAddressErr = err.errors.emailAddress.properties.message;
            } else {
                errors.oldValues.emailAddress = req.body.emailAddress;
            }

            if (typeof err.errors.street != "undefined") {
                errors.streetErr = err.errors.street.properties.message;
            } else {
                errors.oldValues.street = req.body.street;
            }

            if (typeof err.errors.houseNumber != "undefined") {
                errors.houseNumberErr = err.errors.houseNumber.properties.message;
            } else {
                errors.oldValues.houseNumber = req.body.houseNumber;
            }

            if (typeof err.errors.houseNumberAddition != "undefined") {
                errors.houseNumberAdditionErr = err.errors.houseNumberAddition.properties.message;
            } else {
                errors.oldValues.houseNumberAddition = req.body.houseNumberAddition;
            }

            if (typeof err.errors.postalCode != "undefined") {
                errors.postalCodeErr = err.errors.postalCode.properties.message;
            } else {
                errors.oldValues.postalCode = req.body.postalCode;
            }

            if (typeof err.errors.town != "undefined") {
                errors.townErr = err.errors.town.properties.message;
            } else {
                errors.oldValues.town = req.body.town;
            }

            if (typeof err.errors.billingEmailAddress != "undefined") {
                errors.billingEmailAddressErr = err.errors.billingEmailAddress.properties.message;
            } else {
                errors.oldValues.billingEmailAddress = req.body.billingEmailAddress;
            }

            if (typeof err.errors.dateTime != "undefined") {
                errors.dateTimeErr = err.errors.dateTime.properties.message;
            } else {
                errors.oldValues.dateTime = req.body.dateTime;
            }

            if (typeof err.errors.endTime != "undefined") {
                errors.endTimeErr = err.errors.endTime.properties.message;
            } else {
                errors.oldValues.endTime = req.body.endTime;
            }

            if (typeof err.errors.phoneNumber != "undefined") {
                errors.phoneNumberErr = err.errors.phoneNumber.properties.message;
            } else {
                errors.oldValues.phoneNumber = req.body.phoneNumber;
            }

            if (typeof err.errors.playgroundStreet != "undefined") {
                errors.playgroundStreetErr = err.errors.playgroundStreet.properties.message;
            } else {
                errors.oldValues.playgroundStreet = req.body.playgroundStreet;
            }

            if (typeof err.errors.playgroundHouseNumber != "undefined") {
                errors.playgroundHouseNumberErr = err.errors.playgroundHouseNumber.properties.message;
            } else {
                errors.oldValues.playgroundHouseNumber = req.body.playgroundHouseNumber;
            }

            if (typeof err.errors.playgroundHouseNumberAddition != "undefined") {
                errors.playgroundHouseNumberAdditionErr = err.errors.playgroundHouseNumberAddition.properties.message;
            } else {
                errors.oldValues.playgroundHouseNumberAddition = req.body.playgroundHouseNumberAddition;
            }

            if (typeof err.errors.playgroundPostalCode != "undefined") {
                errors.playgroundPostalCodeErr = err.errors.playgroundPostalCode.properties.message;
            } else {
                errors.oldValues.playgroundPostalCode = req.body.playgroundPostalCode;
            }

            if (typeof err.errors.playgroundTown != "undefined") {
                errors.playgroundTownErr = err.errors.playgroundTown.properties.message;
            } else {
                errors.oldValues.playgroundTown = req.body.playgroundTown;
            }

            if (typeof err.errors.makeUpStreet != "undefined") {
                errors.makeUpStreetErr = err.errors.makeUpStreet.properties.message;
            } else {
                errors.oldValues.makeUpStreet = req.body.makeUpStreet;
            }

            if (typeof err.errors.makeUpHouseNumber != "undefined") {
                errors.makeUpHouseNumberErr = err.errors.makeUpHouseNumber.properties.message;
            } else {
                errors.oldValues.makeUpHouseNumber = req.body.makeUpHouseNumber;
            }

            if (typeof err.errors.makeUpHouseNumberAddition != "undefined") {
                errors.makeUpHouseNumberAdditionErr = err.errors.makeUpHouseNumberAddition.properties.message;
            } else {
                errors.oldValues.makeUpHouseNumberAddition = req.body.makeUpHouseNumberAddition;
            }

            if (typeof err.errors.makeUpPostalCode != "undefined") {
                errors.makeUpPostalCodeErr = err.errors.makeUpPostalCode.properties.message;
            } else {
                errors.oldValues.makeUpPostalCode = req.body.makeUpPostalCode;
            }

            if (typeof err.errors.makeUpTown != "undefined") {
                errors.makeUpTownErr = err.errors.makeUpTown.properties.message;
            } else {
                errors.oldValues.makeUpTown = req.body.makeUpTown;
            }

            if (typeof err.errors.amountOfLotusVictims != "undefined") {
                errors.amountOfLotusVictimsErr = err.errors.amountOfLotusVictims.properties.message;
            } else {
                errors.oldValues.amountOfLotusVictims = req.body.amountOfLotusVictims;
            }

            if (typeof err.errors.comments != "undefined") {
                errors.commentsErr = err.errors.comments.properties.message;
            } else {
                errors.oldValues.comments = req.body.comments;
            }

            // Show the errors on the assignment page
            res.render("assignment", { pageName: "Opdracht aanmaken", session: req.session, ...errors, checkedOrNotProfile, checkedOrNotPlayground, checkedOrNotMakeUp, url: req.session.originalUrl });
        } else {
            (async () => {
                // Redirect to the overview

                if (session.user.activeRole === "client") {
                    res.redirect("/assignment?assignmentRequest=true");

                    const objectId = savedAssignment._id;
                    // Create a request
                    const request = await createRequest(req, res, objectId, "createAssignment");
                    // Update assignment
                    await Assignment.findOneAndUpdate({ _id: request.assignmentId }, { $set: { requestId: request._id } });

                    const sendStatus = await notifyCoordinatorRequest(req, res, "createAssignment");

                    if (sendStatus) {
                        console.log("Coordinator notified (Create assignment)");
                    } else {
                        console.log("Mail not send");
                    }
                } else {
                    const objectId = savedAssignment._id;

                    // Get session
                    const session = req.session;
                    // Create request
                    const request = await new Request({
                        userId: session.user.userId,
                        assignmentId: objectId.toString(),
                        type: "createAssignment",
                        status: "Openstaand",
                    });
                    // Save request
                    await request.save();

                    // Update assignment
                    await Assignment.findOneAndUpdate({ _id: request.assignmentId }, { $set: { requestId: request._id } });

                    res.redirect("/assignment");
                }
            })();
        }
    });
};

exports.updateAssignment = async (req, res) => {
    const assignmentId = req.body.assignmentId;

    const { assignmentStatus, firstName, lastName, emailAddress, phoneNumber, endTime, street, houseNumber, houseNumberAddition, postalCode, town, billingEmailAddress, dateTime, playgroundStreet, playgroundHouseNumber, playgroundHouseNumberAddition, playgroundPostalCode, playgroundTown, makeUpStreet, makeUpHouseNumber, makeUpHouseNumberAddition, makeUpPostalCode, makeUpTown, amountOfLotusVictims, comments } = req.body;
    const assignment = { firstName, lastName, emailAddress, phoneNumber, endTime, street, houseNumber, houseNumberAddition, postalCode, town, billingEmailAddress, dateTime, playgroundStreet, playgroundHouseNumber, playgroundHouseNumberAddition, playgroundPostalCode, playgroundTown, makeUpStreet, makeUpHouseNumber, makeUpHouseNumberAddition, makeUpPostalCode, makeUpTown, amountOfLotusVictims, comments };

    const errors = {};
    const oldValues = {};
    errors.oldValues = oldValues;

    if (!firstName || firstName.length === 0) {
        errors.firstNameErr = "Voornaam is verplicht!";
    } else {
        oldValues.firstName = firstName;
    }

    if (!lastName || lastName.length === 0) {
        errors.lastNameErr = "Achternaam is verplicht!";
    } else {
        oldValues.lastName = lastName;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailAddress || emailAddress.length === 0) {
        errors.emailAddressErr = "E-mailadres is verplicht!";
    } else if (!emailRegex.test(emailAddress)) {
        errors.emailAddressErr = "Gebruik een geldig e-mailadres zoals j.doe@gmail.com!";
    } else {
        oldValues.emailAddress = emailAddress;
    }

    if (!phoneNumber || phoneNumber.length === 0) {
        errors.phoneNumberErr = "Telefoonnummer is verplicht!";
    } else if (!phone(phoneNumber, { country: "NL" }).isValid) {
        errors.phoneNumberErr = "Gebruik een geldig telefoonnummer";
    } else {
        oldValues.phoneNumber = phoneNumber;
    }

    if (!street || street.length === 0) {
        errors.streetErr = "Straat is verplicht!";
    } else {
        oldValues.street = street;
    }

    if (!houseNumber || houseNumber.length === 0) {
        errors.houseNumberErr = "Huisnummer is verplicht!";
    } else if (isNaN(houseNumber)) {
        errors.houseNumberErr = "Huisnummer moet een getal zijn!";
    } else {
        oldValues.houseNumber = houseNumber;
    }

    oldValues.houseNumberAddition = houseNumberAddition;

    const postalCodeRegex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;

    if (!postalCode || postalCode.length === 0) {
        errors.postalCodeErr = "Huisnummer is verplicht!";
    } else if (!postalCodeRegex.test(postalCode)) {
        errors.postalCodeErr = "Gebruik een geldig postcode zoals 2973FD!";
    } else {
        oldValues.postalCode = postalCode;
    }

    if (!town || town.length === 0) {
        errors.townErr = "Plaats is verplicht!";
    } else {
        oldValues.town = town;
    }

    //playground
    if (!playgroundStreet || playgroundStreet.length === 0) {
        errors.playgroundStreetErr = "Speelplaats straat is verplicht!";
    } else {
        oldValues.playgroundStreet = playgroundStreet;
    }

    if (!playgroundHouseNumber || playgroundHouseNumber.length === 0) {
        errors.playgroundHouseNumber = "Speelplaats huisnummer is verplicht!";
    } else if (isNaN(playgroundHouseNumber)) {
        errors.playgroundHouseNumber = "Speelplaats huisnummer moet een getal zijn!";
    } else {
        oldValues.playgroundHouseNumber = playgroundHouseNumber;
    }

    oldValues.playgroundHouseNumberAddition = playgroundHouseNumberAddition;

    if (!playgroundPostalCode || playgroundPostalCode.length === 0) {
        errors.playgroundPostalCode = "Speelplaats postcode is verplicht!";
    } else if (!postalCodeRegex.test(playgroundPostalCode)) {
        errors.playgroundPostalCodeErr = "Gebruik een geldig postcode zoals 2973FD!";
    } else {
        oldValues.playgroundPostalCode = playgroundPostalCode;
    }

    if (!playgroundTown || playgroundTown.length === 0) {
        errors.playgroundTownErr = "Speelplaats plaats is verplicht!";
    } else {
        oldValues.playgroundTown = playgroundTown;
    }

    //makeup
    oldValues.makeUpStreet = makeUpStreet;
    oldValues.makeUpHouseNumber = makeUpHouseNumber;
    oldValues.makeUpHouseNumberAddition = makeUpHouseNumberAddition;
    oldValues.makeUpPostalCode = makeUpPostalCode;
    oldValues.makeUpTown = makeUpTown;

    //overige

    if (!dateTime || dateTime.length === 0) {
        errors.dateTimeErr = "Begindatum en begintijd zijn verplicht!";
    } else if (new Date().toISOString() > dateTime) {
        errors.dateTimeErr = "De ingevoerde datum is verstreken!";
    } else {
        oldValues.dateTime = dateTime;
    }

    if (!endTime || endTime.length === 0) {
        errors.endTimeErr = "Einddatum en eindtijd zijn verplicht!";
    } else if (dateTime > endTime) {
        errors.endTimeErr = "De eindtijd moet plaatsvinden na de begintijd!";
    } else {
        oldValues.endTime = endTime;
    }

    (async () => {
        let tempAssignment = await Assignment.find({ _id: assignmentId });
        tempAssignment = tempAssignment[0];

        if (!amountOfLotusVictims || amountOfLotusVictims.length === 0) {
            errors.amountOfLotusVictimsErr = "Aantal LOTUS slachtoffers is verplicht!";
        } else if (isNaN(amountOfLotusVictims)) {
            errors.amountOfLotusVictimsErr = "Aantal LOTUS slachtoffers moet een getal zijn!";
        } else if (amountOfLotusVictims < 1) {
            errors.amountOfLotusVictimsErr = `Aantal LOTUSslachtoffers moet minimaal 1 zijn!`;
        } else if (tempAssignment.participatingLotusVictims.length > amountOfLotusVictims) {
            errors.amountOfLotusVictimsErr = `Er zijn al ${tempAssignment.participatingLotusVictims.length} LOTUSslachtoffers ingeschreven!`;
        } else {
            oldValues.amountOfLotusVictims = amountOfLotusVictims;
        }

        oldValues.comments = comments;

        //factuur
        if (!billingEmailAddress || billingEmailAddress.length === 0) {
            errors.billingEmailAddressErr = "E-mailadres is verplicht!";
        } else if (!emailRegex.test(billingEmailAddress)) {
            errors.billingEmailAddressErr = "Gebruik een geldig e-mailadres zoals j.doe@gmail.com!";
        } else {
            oldValues.billingEmailAddress = billingEmailAddress;
        }

        if (
            typeof errors.firstNameErr != "undefined" ||
            typeof errors.lastNameErr != "undefined" ||
            typeof errors.emailAddressErr != "undefined" ||
            typeof errors.phoneNumberErr != "undefined" ||
            typeof errors.streetErr != "undefined" ||
            typeof errors.houseNumberErr != "undefined" ||
            typeof errors.postalCodeErr != "undefined" ||
            typeof errors.townErr != "undefined" ||
            typeof errors.playgroundStreetErr != "undefined" ||
            typeof errors.playgroundHouseNumberErr != "undefined" ||
            typeof errors.playgroundPostalCodeErr != "undefined" ||
            typeof errors.playgroundTownErr != "undefined" ||
            typeof errors.dateTimeErr != "undefined" ||
            typeof errors.endTimeErr != "undefined" ||
            typeof errors.amountOfLotusVictimsErr != "undefined" ||
            typeof errors.billingEmailAddressErr != "undefined"
        ) {
            res.render("assignment", { pageName: "Formulier", session: req.session, ...errors, url: req.session.originalUrl, assignmentId, assignmentStatus });
        } else {
            (async () => {
                if (req.session.user.activeRole === "coordinator" || assignmentStatus === "In behandeling") {
                    const updatedAssignment = await Assignment.findOneAndUpdate({ _id: assignmentId }, { ...assignment }, { new: true });

                    //TODO: when max participants is increased check if assignment was complete. If so set the status to open

                    res.redirect("/assignment?assignmentUpdate=true");

                    if (req.session.user.activeRole === "coordinator") {
                        const sendStatus = await notifyUserThroughMail(updatedAssignment.emailAddress, updatedAssignment.firstName, "clientAssignmentUpdated", "Jouw opdracht is bewerkt");

                        if (sendStatus) {
                            console.log("Client notified (Updated assignment)");
                        } else {
                            console.log("Email not send");
                        }
                    }
                } else {
                    const request = await new Request({
                        userId: req.session.user.userId,
                        assignmentId: assignmentId.toString(),
                        type: "updateAssignment",
                        updatedAssignment: { ...req.body },
                    });
                    // Save request
                    request.save();

                    (async () => {
                        res.redirect("/assignment?assignmentUpdateRequest=true");

                        const sendStatus = await notifyCoordinatorRequest(req, res, "updateAssignment");

                        if (sendStatus) {
                            console.log("Coordinator notified (Update assignment)");
                        } else {
                            console.log("Mail not send");
                        }
                    })();
                }
            })();
        }
    })();
};

exports.getAssignmentPage = (req, res) => {
    req.session.originalUrl = req.originalUrl;
    res.render("assignment", { pageName: "Opdracht aanmaken", session: req.session, url: req.session.originalUrl, assignmentId: req.query.id });
};

exports.getAssignmentUpdatePage = async (req, res) => {
    const assignmentId = req.query.assignmentId;
    const assignmentStatus = req.query.assignmentStatus;

    let assignment = await Assignment.find({ _id: assignmentId });

    assignment = assignment[0];

    req.session.originalUrl = req.originalUrl;
    res.render("assignment", { pageName: "Opdracht bewerken", session: req.session, url: req.session.originalUrl, assignmentId: assignmentId, assignment, assignmentStatus });
};

exports.getAllAssignments = (req, res) => {
    const url = req.originalUrl;
    let sortPlaygroundValue;
    let sortDateValue;
    let searchValue;

    let alertText = "";
    if (req.query.assignmentCreate) {
        alertText = "Opdracht succesvol aangemaakt!";
    } else if (req.query.assignmentRequest) {
        alertText = "Aanmaken van opdracht succesvol aangevraagd!";
    } else if (req.query.assignmentUpdate) {
        alertText = "Opdracht succesvol gewijzigd!";
    } else if (req.query.assignmentUpdateRequest) {
        alertText = "Wijzigen van opdracht succesvol aangevraagd!";
    } else if (req.query.acceptEnroll) {
        alertText = "Inschrijving voor opdracht is succesvol aangevraagd!";
    }

    if (url.includes("sortPlayground")) {
        sortPlaygroundValue = req.query.sortPlayground;
    }

    if (url.includes("sortDate")) {
        sortDateValue = req.query.sortDate;
    }

    if (url.includes("keyword")) {
        searchValue = req.query.keyword.toLowerCase();
    }

    function format(inputDate) {
        return new Date(inputDate).toLocaleString([], { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    if (req.session.user.activeRole == "coordinator") {
        let resultsFiltered = [];
        let resultsSearchedFiltered = [];

        if (req.session.assignments_filtered) {
            resultsSearchedFiltered = req.session.assignments_filtered;

            if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                let searchedAssignments = [];

                resultsSearchedFiltered.forEach((assignment) => {
                    if (assignment.playgroundTown.toLowerCase() == searchValue) {
                        searchedAssignments.push(assignment);
                    } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                        searchedAssignments.push(assignment);
                    }
                });

                req.session.assignments_filtered = searchedAssignments;

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
            } else if (sortPlaygroundValue == "true") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
            } else if (sortDateValue == "true") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
            } else if (sortPlaygroundValue == "false") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
            } else if (sortDateValue == "false") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
            } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                Assignment.find({ isApproved: true }, async function (err, results) {
                    for (let result of results) {
                        let enrolledRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "In behandeling" }).exec();
                        let enrolledApprovedRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
                        let formattedDateTime = format(new Date(result.dateTime));

                        if (enrolledRequest.length > 0) {
                            result = {
                                ...result._doc,
                                formattedDateTime,
                                status: "Ingeschreven",
                            };
                            resultsFiltered.push(result);
                        } else if (enrolledApprovedRequest.length > 0) {
                            result = {
                                ...result._doc,
                                formattedDateTime,
                                status: "Ingeschreven voltooid",
                            };
                            resultsFiltered.push(result);
                        } else {
                            result = {
                                ...result._doc,
                                formattedDateTime,
                                status: "Niet ingeschreven",
                            };
                            resultsFiltered.push(result);
                        }
                    }

                    req.session.assignments_filtered = undefined;
                    res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                });
            }
        } else {
            Assignment.find({ isApproved: true }, async function (err, results) {
                for (let result of results) {
                    let enrolledRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "In behandeling" }).exec();
                    let enrolledApprovedRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
                    let formattedDateTime = format(new Date(result.dateTime));

                    if (enrolledRequest.length > 0) {
                        result = {
                            ...result._doc,
                            formattedDateTime,
                            status: "Ingeschreven",
                        };
                        resultsFiltered.push(result);
                    } else if (enrolledApprovedRequest.length > 0) {
                        result = {
                            ...result._doc,
                            formattedDateTime,
                            status: "Ingeschreven voltooid",
                        };
                        resultsFiltered.push(result);
                    } else {
                        result = {
                            ...result._doc,
                            formattedDateTime,
                            status: "Niet ingeschreven",
                        };
                        resultsFiltered.push(result);
                    }
                }

                if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                    let searchedAssignments = [];

                    resultsFiltered.forEach((assignment) => {
                        if (assignment.playgroundTown.toLowerCase() == searchValue) {
                            searchedAssignments.push(assignment);
                        } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                            searchedAssignments.push(assignment);
                        }
                    });

                    req.session.assignments_filtered = searchedAssignments;

                    res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                } else if (sortPlaygroundValue == "true") {
                    let alphabeticAssignments = [];
                    alphabeticAssignments = resultsFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                    res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
                } else if (sortDateValue == "true") {
                    let dateAssignments = [];
                    dateAssignments = resultsFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                    res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
                } else if (sortPlaygroundValue == "false") {
                    let alphabeticAssignments = [];
                    alphabeticAssignments = resultsFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                    res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
                } else if (sortDateValue == "false") {
                    let dateAssignments = [];
                    dateAssignments = resultsFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                    res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
                } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                    req.session.assignments_filtered = undefined;
                    res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                }
            });
        }
    } else if (req.session.user.activeRole == "member") {
        let resultsFiltered = [];
        let resultsSearchedFiltered = [];

        if (req.session.assignments_filtered) {
            resultsSearchedFiltered = req.session.assignments_filtered;

            if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                let searchedAssignments = [];

                resultsSearchedFiltered.forEach((assignment) => {
                    if (assignment.playgroundTown.toLowerCase() == searchValue) {
                        searchedAssignments.push(assignment);
                    } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                        searchedAssignments.push(assignment);
                    }
                });

                req.session.assignments_filtered = searchedAssignments;

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
            } else if (sortPlaygroundValue == "true") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
            } else if (sortDateValue == "true") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
            } else if (sortPlaygroundValue == "false") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
            } else if (sortDateValue == "false") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
            } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                Assignment.find(
                    {
                        isApproved: true,
                        dateTime: { $gte: new Date().toISOString() },
                    },
                    async (err, results) => {
                        for await (let result of results) {
                            let enrolledRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "In behandeling" }).exec();
                            let enrolledApprovedRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
                            let rejectedRequests = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Afgewezen" }).exec();
                            let formattedDateTime = format(new Date(result.dateTime));

                            console.log(enrolledRequest);

                            if (rejectedRequests.length === 0) {
                                if (result.participatingLotusVictims.length !== result.amountOfLotusVictims) {
                                    if (enrolledRequest.length > 0) {
                                        result = {
                                            ...result._doc,
                                            formattedDateTime,
                                            status: "Ingeschreven",
                                        };
                                        resultsFiltered.push(result);
                                    } else if (enrolledApprovedRequest.length > 0) {
                                        result = {
                                            ...result._doc,
                                            formattedDateTime,
                                            status: "Ingeschreven voltooid",
                                        };
                                    } else {
                                        result = {
                                            ...result._doc,
                                            formattedDateTime,
                                            status: "Niet ingeschreven",
                                        };
                                        resultsFiltered.push(result);
                                    }
                                }
                            }
                        }

                        req.session.assignments_filtered = undefined;
                        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                    }
                );
            }
        } else {
            Assignment.find(
                {
                    isApproved: true,
                    dateTime: { $gte: new Date().toISOString() },
                },
                async (err, results) => {
                    for await (let result of results) {
                        let enrolledRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "In behandeling" }).exec();
                        let enrolledApprovedRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
                        let rejectedRequests = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Afgewezen" }).exec();
                        let formattedDateTime = format(new Date(result.dateTime));

                        if (rejectedRequests.length === 0) {
                            if (result.participatingLotusVictims.length !== result.amountOfLotusVictims) {
                                if (enrolledRequest.length > 0) {
                                    result = {
                                        ...result._doc,
                                        formattedDateTime,
                                        status: "Ingeschreven",
                                    };
                                    resultsFiltered.push(result);
                                } else if (enrolledApprovedRequest.length > 0) {
                                    result = {
                                        ...result._doc,
                                        formattedDateTime,
                                        status: "Ingeschreven voltooid",
                                    };
                                } else {
                                    result = {
                                        ...result._doc,
                                        formattedDateTime,
                                        status: "Niet ingeschreven",
                                    };
                                    resultsFiltered.push(result);
                                }
                            }
                        }
                    }

                    if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                        let searchedAssignments = [];

                        resultsFiltered.forEach((assignment) => {
                            if (assignment.playgroundTown.toLowerCase() == searchValue) {
                                searchedAssignments.push(assignment);
                            } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                                searchedAssignments.push(assignment);
                            }
                        });

                        req.session.assignments_filtered = searchedAssignments;

                        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                    } else if (sortPlaygroundValue == "true") {
                        let alphabeticAssignments = [];
                        alphabeticAssignments = resultsFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
                    } else if (sortDateValue == "true") {
                        let dateAssignments = [];
                        dateAssignments = resultsFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
                    } else if (sortPlaygroundValue == "false") {
                        let alphabeticAssignments = [];
                        alphabeticAssignments = resultsFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
                    } else if (sortDateValue == "false") {
                        let dateAssignments = [];
                        dateAssignments = resultsFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
                    } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                        req.session.assignments_filtered = undefined;
                        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                    }
                }
            );
        }
    } else if (req.session.user.activeRole == "client") {
        let resultsFiltered = [];
        let resultsSearchedFiltered = [];

        if (req.session.assignments_filtered) {
            resultsSearchedFiltered = req.session.assignments_filtered;

            if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                let searchedAssignments = [];

                resultsSearchedFiltered.forEach((assignment) => {
                    if (assignment.playgroundTown.toLowerCase() == searchValue) {
                        searchedAssignments.push(assignment);
                    } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                        searchedAssignments.push(assignment);
                    }
                });

                req.session.assignments_filtered = searchedAssignments;

                res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
            } else if (sortPlaygroundValue == "true") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
            } else if (sortDateValue == "true") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
            } else if (sortPlaygroundValue == "false") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
            } else if (sortDateValue == "false") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
            } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                Assignment.find(async function (err, results) {
                    for (let result of results) {
                        if (result.emailAddress == req.session.user.emailAddress) {
                            let request = await Request.find({ _id: result.requestId }).exec();
                            let updatedAssignmentRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "updateAssignment", status: "In behandeling" }).exec();
                            let cancelRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "deleteAssignment", status: "In behandeling" }).exec();
                            let formattedDateTime = format(new Date(result.dateTime));

                            if (cancelRequest.length > 0) {
                                result = {
                                    ...result._doc,
                                    status: request[0].status,
                                    requestStatus: "Aangevraagd",
                                    formattedDateTime,
                                    cancelStatus: "Verwijderverzoek ingediend",
                                };
                            } else if (updatedAssignmentRequest.length > 0) {
                                result = {
                                    ...result._doc,
                                    status: request[0].status,
                                    requestStatus: "Aangevraagd",
                                    formattedDateTime,
                                    cancelStatus: "Updateverzoek ingediend",
                                };
                            } else {
                                result = {
                                    ...result._doc,
                                    formattedDateTime,
                                    status: request[0].status,
                                };
                            }
                            resultsFiltered.push(result);
                        }
                    }

                    req.session.assignments_filtered = undefined;
                    res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                });
            }
        } else {
            Assignment.find(async function (err, results) {
                for (let result of results) {
                    if (result.emailAddress == req.session.user.emailAddress) {
                        let request = await Request.find({ _id: result.requestId }).exec();
                        let updatedAssignmentRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "updateAssignment", status: "In behandeling" }).exec();
                        let cancelRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "deleteAssignment", status: "In behandeling" }).exec();
                        let formattedDateTime = format(new Date(result.dateTime));

                        if (cancelRequest.length > 0) {
                            result = {
                                ...result._doc,
                                status: request[0].status,
                                requestStatus: "Aangevraagd",
                                formattedDateTime,
                                cancelStatus: "Verwijderverzoek ingediend",
                            };
                        } else if (updatedAssignmentRequest.length > 0) {
                            result = {
                                ...result._doc,
                                status: request[0].status,
                                requestStatus: "Aangevraagd",
                                formattedDateTime,
                                cancelStatus: "Updateverzoek ingediend",
                            };
                        } else {
                            result = {
                                ...result._doc,
                                formattedDateTime,
                                status: request[0].status,
                            };
                        }
                        resultsFiltered.push(result);
                    }
                }

                if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                    let searchedAssignments = [];

                    resultsFiltered.forEach((assignment) => {
                        if (assignment.playgroundTown.toLowerCase() == searchValue) {
                            searchedAssignments.push(assignment);
                        } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                            searchedAssignments.push(assignment);
                        }
                    });

                    req.session.assignments_filtered = searchedAssignments;

                    res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                } else if (sortPlaygroundValue == "true") {
                    let alphabeticAssignments = [];
                    alphabeticAssignments = resultsFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                    res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
                } else if (sortDateValue == "true") {
                    let dateAssignments = [];
                    dateAssignments = resultsFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                    res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
                } else if (sortPlaygroundValue == "false") {
                    let alphabeticAssignments = [];
                    alphabeticAssignments = resultsFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                    res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined, alertText });
                } else if (sortDateValue == "false") {
                    let dateAssignments = [];
                    dateAssignments = resultsFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                    res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue, alertText });
                } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                    req.session.assignments_filtered = undefined;
                    res.render("assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined, alertText });
                }
            });
        }
    }
};

exports.getMemberAssignments = (req, res) => {
    const url = req.originalUrl;
    let sortPlaygroundValue;
    let sortDateValue;
    let searchValue;

    if (url.includes("sortPlayground")) {
        sortPlaygroundValue = req.query.sortPlayground;
    }

    if (url.includes("sortDate")) {
        sortDateValue = req.query.sortDate;
    }

    if (url.includes("keyword")) {
        searchValue = req.query.keyword.toLowerCase();
    }

    function format(inputDate) {
        let date, month, year;

        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();

        date = date.toString().padStart(2, "0");

        month = month.toString().padStart(2, "0");

        return `${date}/${month}/${year}`;
    }

    if (req.session.user.activeRole == "member") {
        let resultsFiltered = [];
        let resultsSearchedFiltered = [];

        if (req.session.assignments_filtered) {
            resultsSearchedFiltered = req.session.assignments_filtered;

            if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                let searchedAssignments = [];

                resultsSearchedFiltered.forEach((assignment) => {
                    if (assignment.playgroundTown.toLowerCase() == searchValue) {
                        searchedAssignments.push(assignment);
                    } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                        searchedAssignments.push(assignment);
                    }
                });

                req.session.assignments_filtered = searchedAssignments;

                res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined });
            } else if (sortPlaygroundValue == "true") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined });
            } else if (sortDateValue == "true") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue });
            } else if (sortPlaygroundValue == "false") {
                let alphabeticAssignments = [];
                alphabeticAssignments = resultsSearchedFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined });
            } else if (sortDateValue == "false") {
                let dateAssignments = [];
                dateAssignments = resultsSearchedFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue });
            } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                Assignment.find({ isApproved: true }, async function (err, results) {
                    for (let result of results) {
                        let enrolledApprovedRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
                        let cancelRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "cancelEnrollment", status: "In behandeling" }).exec();
                        let formattedDateTime = format(new Date(result.dateTime));

                        if (enrolledApprovedRequest.length > 0 && cancelRequest.length > 0) {
                            result = {
                                ...result._doc,
                                status: "Ingeschreven voltooid",
                                formattedDateTime,
                                cancelStatus: "Uitschrijfverzoek ingediend",
                            };
                            resultsFiltered.push(result);
                        } else if (enrolledApprovedRequest.length > 0) {
                            result = {
                                ...result._doc,
                                formattedDateTime,
                                status: "Ingeschreven voltooid",
                            };
                            resultsFiltered.push(result);
                        }
                    }

                    req.session.assignments_filtered = undefined;
                    res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined });
                });
            }
        } else {
            Assignment.find({ isApproved: true }, async function (err, results) {
                for (let result of results) {
                    let enrolledApprovedRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
                    let cancelRequest = await Request.find({ assignmentId: result._id, userId: req.session.user.userId, type: "cancelEnrollment", status: "In behandeling" }).exec();
                    let formattedDateTime = format(new Date(result.dateTime));

                    if (enrolledApprovedRequest.length > 0 && cancelRequest.length > 0) {
                        result = {
                            ...result._doc,
                            status: "Ingeschreven voltooid",
                            formattedDateTime,
                            cancelStatus: "Uitschrijfverzoek ingediend",
                        };
                        resultsFiltered.push(result);
                    } else if (enrolledApprovedRequest.length > 0) {
                        result = {
                            ...result._doc,
                            formattedDateTime,
                            status: "Ingeschreven voltooid",
                        };
                        resultsFiltered.push(result);
                    }
                }

                if (searchValue && sortPlaygroundValue == undefined && sortDateValue == undefined) {
                    let searchedAssignments = [];

                    resultsFiltered.forEach((assignment) => {
                        if (assignment.playgroundTown.toLowerCase() == searchValue) {
                            searchedAssignments.push(assignment);
                        } else if (searchValue.startsWith(assignment.playgroundTown.substr(0, searchValue.length).toLowerCase())) {
                            searchedAssignments.push(assignment);
                        }
                    });

                    req.session.assignments_filtered = searchedAssignments;

                    res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: searchedAssignments, sortPlaygroundValue: undefined, sortDateValue: undefined });
                } else if (sortPlaygroundValue == "true") {
                    let alphabeticAssignments = [];
                    alphabeticAssignments = resultsFiltered.sort((a, b) => a.playgroundTown.localeCompare(b.playgroundTown));

                    res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined });
                } else if (sortDateValue == "true") {
                    let dateAssignments = [];
                    dateAssignments = resultsFiltered.sort((a, b) => a.dateTime.localeCompare(b.dateTime));

                    res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue });
                } else if (sortPlaygroundValue == "false") {
                    let alphabeticAssignments = [];
                    alphabeticAssignments = resultsFiltered.sort((a, b) => b.playgroundTown.localeCompare(a.playgroundTown));

                    res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: alphabeticAssignments, sortPlaygroundValue, sortDateValue: undefined });
                } else if (sortDateValue == "false") {
                    let dateAssignments = [];
                    dateAssignments = resultsFiltered.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

                    res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: dateAssignments, sortPlaygroundValue: undefined, sortDateValue });
                } else if (sortPlaygroundValue == undefined && sortDateValue == undefined) {
                    req.session.assignments_filtered = undefined;
                    res.render("enrolled_assignment_overview", { pageName: "Mijn opdrachten", session: req.session, assignments: resultsFiltered, sortPlaygroundValue: undefined, sortDateValue: undefined });
                }
            });
        }
    }
};

exports.getAssignmentDetailPage = (req, res) => {
    Assignment.find({ _id: req.query.id }, function (err, results) {
        res.render("assignment_detail", { pageName: "Detailpagina", session: req.session, assignments: results });
    });
};

exports.deleteAssignment = async (req, res) => {
    // Get session
    const session = req.session;
    // Get req body
    const { status, cancelStatus } = req.body;

    if (session.user.activeRole === "coordinator") {
        await Assignment.deleteOne({ _id: req.query.id });
        await Request.deleteMany({ assignmentId: req.query.id });

        const sendStatus = await notifyUserThroughMail(req.query.emailAddress, req.query.firstName, "clientAssignmentDeleted", "Jouw opdracht is verwijderd");

        if (sendStatus) {
            console.log("Client notified (Deleted assignment)");
        } else {
            console.log("Email not send");
        }

        res.redirect("/assignment?deleteAssignment=true");
    }

    if (session.user.activeRole === "client") {
        res.redirect("/assignment");
        if (status == "Afgewezen" || status == "In behandeling") {
            await Assignment.deleteOne({ _id: req.query.id });
            await Request.deleteMany({ assignmentId: req.query.id });
        } else if (cancelStatus == "Verwijderverzoek ingediend") {
            await Request.deleteMany({ requestType: "deleteAssignment", assignmentId: req.query.id, status: "In behandeling" });
        } else if (cancelStatus == "Updateverzoek ingediend") {
            await Request.deleteMany({ requestType: "updateAssignment", assignmentId: req.query.id, status: "In behandeling" });
        } else {
            await createRequest(req, res, req.query.id, "deleteAssignment");

            const sendStatus = await notifyCoordinatorRequest(req, res, "deleteAssignment");

            if (sendStatus) {
                console.log("Coordinator notified (Delete assignment)");
            } else {
                console.log("Mail not send");
            }
        }
    }
};

exports.enrollAssignment = (req, res) => {
    // Get session
    const session = req.session;
    // Get req body
    const { requestType, assignmentId } = req.body;
    // Create request
    const request = new Request({
        userId: session.user.userId,
        assignmentId: assignmentId,
        type: requestType,
    });
    // Save request
    request.save();

    (async () => {
        // Redirect
        res.redirect("/assignment?acceptEnroll=true");

        const sendStatus = await notifyCoordinatorRequest(req, res, "enrollment");

        if (sendStatus) {
            console.log("Coordinator notified (Enrollment)");
        } else {
            console.log("Mail not send");
        }
    })();
};

exports.cancelEnrollment = (req, res) => {
    // Get session
    const session = req.session;
    // Get req body
    const { requestType, assignmentId, status, cancelStatus } = req.body;
    if (status == "Ingeschreven") {
        Request.deleteOne({ requestType: "enrollment", assignmentId: assignmentId, userId: session.user.userId }, function (err, results) {
            Assignment.findOneAndUpdate({ assignmentId: assignmentId }, { status: "Niet ingeschreven" });
            res.redirect("/assignment?cancelRequest=true");
        });
    } else if (cancelStatus == "Uitschrijfverzoek ingediend") {
        Request.deleteOne({ requestType: "cancelEnrollment", assignmentId: assignmentId, userId: session.user.userId, status: "In behandeling" }, function (err, results) {
            res.redirect("/member/assignment");
        });
    } else {
        Request.find({ assignmentId: assignmentId, userId: session.user.userId, type: requestType }, function (err, results) {
            if (results.length == 0) {
                // Create request
                const request = new Request({
                    userId: session.user.userId,
                    assignmentId: assignmentId,
                    type: requestType,
                });
                // Save request
                request.save();

                (async () => {
                    // Redirect
                    res.redirect("/member/assignment");

                    const sendStatus = await notifyCoordinatorRequest(req, res, "cancelEnrollment");

                    if (sendStatus) {
                        console.log("Coordinator notified (Cancel enrollment)");
                    } else {
                        console.log("Mail not send");
                    }
                })();
            } else {
                // Redirect
                res.redirect("/assignment");
            }
        });
    }
};

exports.deleteMemberFromAssignment = async (req, res) => {
    const victimId = req.query.victimId;
    const assignmentId = req.query.assignmentId;

    await Request.deleteMany({ userId: victimId, assignmentId: assignmentId });
    await Assignment.updateOne({ _id: assignmentId }, { $pull: { participatingLotusVictims: { _id: victimId } } });
    await Request.findOneAndUpdate({ assignmentId: assignmentId, type: "createAssignment" }, { $set: { status: "Openstaand" } });

    res.redirect("/assignment");

    let victimData = await User.find({ _id: victimId });
    victimData = victimData[0];

    const sendStatus = await notifyUserThroughMail(victimData.emailAddress, victimData.firstName, "removeMemberFromAssignment", "Je bent uitgeschreven");

    if (sendStatus) {
        console.log("Client notified (Removed member from assignment)");
    } else {
        console.log("Email not send");
    }
};

exports.sendPDFdata = async (req, res, next) => {
    const assignmentId = req.query.assignmentId;
    let assignment = await Assignment.find({ _id: assignmentId }).exec();

    let request = await Request.find({ assignmentId: assignmentId, type: "enrollment", status: "Goedgekeurd" }).exec();

    assignment = {
        ...assignment[0]._doc,
        request: { ...request[0]._doc },
    };

    await this.getPDF(req, res, assignment);
};

exports.getPDF = async (req, res, assignment) => {
    function formatDate(inputDate) {
        let date, month, year;

        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();

        date = date.toString().padStart(2, "0");

        month = month.toString().padStart(2, "0");

        return `${date}-${month}-${year}`;
    }

    const stream = res.writeHead(200, {
        "Content-Type": "application/",
        "Content-Disposition": `attachment;filename=LOTUS_${assignment.playgroundTown}_${formatDate(new Date(assignment.dateTime))}_contract.pdf`,
    });

    await pdfService.buildPDF(
        (chunk) => stream.write(chunk),
        () => stream.end(),
        assignment
    );
};
