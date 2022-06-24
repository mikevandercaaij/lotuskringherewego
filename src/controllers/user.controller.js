const bcrypt = require("bcrypt");
const mongoose = require("./../../database/dbconnection");
const { sendMemberInviteMail, notifyUserThroughMail, notifyCoordinatorRequest } = require("./../controllers/mail.controller");
const userController = require("./../controllers/user.controller");
const { userModel } = require("./../models/user.model");
const passGenerator = require("generate-password");
const { phone } = require("phone");
const { assignmentModel } = require("../models/assignment.model");
const Assignment = assignmentModel;
const Request = require("../models/request.model");
const User = userModel;

// Functionality for creating an user
exports.createUser = (req, res) => {
    // Declare all variables out of req.body
    let { firstName, lastName, emailAddress, phoneNumber, password, confirmPassword, street, houseNumber, houseNumberAddition, postalCode, town } = req.body;
    emailAddress = emailAddress.toLowerCase();
    // Create new user object
    const user = new User({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        password: password,
        confirmPassword: confirmPassword,
        street: street,
        houseNumber: houseNumber,
        houseNumberAddition: houseNumberAddition,
        postalCode: postalCode,
        town: town,
        roles: ["client"],
        activeRole: ["client"],
        lastLoginDate: Date.now(),
    });
    // Save user object in database and show errors if they exists
    user.save((err) => {
        if (err) {
            let errors = {};
            let oldValues = {};
            errors.oldValues = oldValues;

            if (err.keyValue != undefined) {
                if (err.keyValue.emailAddress == emailAddress) {
                    errors.emailAddressErr = "E-mailadres is al in gebruik!";
                }
            } else {
                if (err.errors.firstName) {
                    errors.firstNameErr = err.errors.firstName.properties.message;
                } else {
                    oldValues.firstName = firstName;
                }

                if (err.errors.lastName) {
                    errors.lastNameErr = err.errors.lastName.properties.message;
                } else {
                    oldValues.lastName = lastName;
                }

                if (err.errors.emailAddress) {
                    errors.emailAddressErr = err.errors.emailAddress.properties.message;
                } else {
                    oldValues.emailAddress = emailAddress;
                }

                if (err.errors.phoneNumber) {
                    errors.phoneNumberErr = err.errors.phoneNumber.properties.message;
                } else {
                    oldValues.phoneNumber = phoneNumber;
                }

                if (err.errors.password) {
                    errors.passwordErr = err.errors.password.properties.message;
                } else {
                    oldValues.password = password;
                }

                if (err.errors.confirmPassword) {
                    errors.confirmPasswordErr = err.errors.confirmPassword.properties.message;
                } else {
                    oldValues.confirmPassword = confirmPassword;
                }

                if (err.errors.street) {
                    errors.streetErr = err.errors.street.properties.message;
                } else {
                    oldValues.street = street;
                }

                if (isNaN(houseNumber)) {
                    errors.houseNumberErr = "Huisnummer moet een getal zijn!";
                } else if (err.errors.houseNumber) {
                    errors.houseNumberErr = err.errors.houseNumber.properties.message;
                } else {
                    oldValues.houseNumber = houseNumber;
                }

                if (houseNumberAddition || !houseNumberAddition.length === 0) {
                    oldValues.houseNumberAddition = houseNumberAddition;
                }

                if (err.errors.postalCode) {
                    errors.postalCodeErr = err.errors.postalCode.properties.message;
                } else {
                    oldValues.postalCode = postalCode;
                }

                if (err.errors.town) {
                    errors.townErr = err.errors.town.properties.message;
                } else {
                    oldValues.town = town;
                }
            }
            // Show the errors on the register page
            res.render("register", { pageName: "Registreren", ...errors });
        } else {
            (async () => {
                let user = await User.find({ emailAddress: emailAddress });
                user = user[0];

                let session = req.session;
                session.user = {
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    phoneNumber: user.phoneNumber,
                    street: user.street,
                    houseNumber: user.houseNumber,
                    houseNumberAddition: user.houseNumberAddition,
                    postalCode: user.postalCode,
                    town: user.town,
                    roles: user.roles,
                    activeRole: user.activeRole[0],
                    createdDate: user.createdDate,
                    lastLoginDate: user.lastLoginDate,
                };

                return res.redirect("/");
            })();
        }
    });
};

// Functionality for getting user by email
exports.getUserByEmailAddress = async (req, res) => {
    try {
        return await User.find({ emailAddress: req.body.emailAddress }).exec();
    } catch (err) {
        throw err;
    }
};

// Functionality for getting user by id
exports.createMember = (req, res) => {
    (async () => {
        let emailAddress = req.body.emailAddress;
        emailAddress = emailAddress.toLowerCase();
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        const allMembers = await exports.getAllValidMembers();
        const allClients = await exports.getAllValidClients();
        const allInvitedMembers = await exports.getAllInvitedMembers();

        if (emailRegex.test(emailAddress)) {
            (async () => {
                const result = await this.getUserByEmailAddress(req, res);

                if (result.length === 0) {
                    const password = await insertMember(emailAddress);
                    const sendStatus = await sendMemberInviteMail(emailAddress, password);

                    if (sendStatus) {
                        console.log("Send");
                    } else {
                        console.log("Not send");
                    }

                    res.redirect("/user?invitedMember=true");
                } else {
                    res.render("user_overview", { pageName: "Gebruikers", session: req.session, emailAddressErr: "Dit e-mailadres is al in gebruik!", allMembers, allClients, allInvitedMembers });
                }
            })();
        } else {
            res.render("user_overview", { pageName: "Gebruikers", session: req.session, emailAddressErr: "Het ingevulde e-mailadres is ongeldig!", allMembers, allClients, allInvitedMembers });
        }
    })();
};

exports.notifyInvitedMember = async (req, res) => {
    const { emailAddress } = req.body;

    const sendStatus = await notifyUserThroughMail(emailAddress, "", "remindInvitedMember", "Account activatie (herinnering)");

    if (sendStatus) {
        console.log("Invited member reminded");
    } else {
        console.log("Mail did not send");
    }

    return res.redirect("/user?remindedMember=true");
};

const insertMember = async (emailAddress) => {
    const password = passGenerator.generate({ length: 10, numbers: true, uppercase: true, lowercase: true });

    const user = new User({
        firstName: "",
        lastName: "",
        emailAddress: emailAddress,
        password: password,
        confirmPassword: password,
        roles: ["member"],
        activeRole: ["member"],
    });

    user.save({ validateBeforeSave: false });

    return password;
};

exports.getUserProfile = async (req, res) => {
    const roleRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: { $ne: "Afgewezen" } });
    const roleProcessingRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: "In behandeling" });
    let type = "";

    let alertText = "";
    if (req.query.changedProfile) {
        alertText = "Gegevens zijn succesvol gewijzigd!";
    } else if (req.query.requestRole) {
        alertText = "Nieuwe rol aangevraagd!";
    } 

    
    if (req.query.rolesUpdate) {
        type = "roles_request";
    }

    res.render("user_profile", { pageName: "Mijn profiel", session: req.session, alertText, roleRequest, roleProcessingRequest, type });
};

exports.changeUserProfileDetails = (req, res) => {
    let { firstName, lastName, emailAddress, phoneNumber, type, street, houseNumber, houseNumberAddition, town, postalCode } = req.body;
    emailAddress = emailAddress.toLowerCase();

    const errors = {};
    const oldValues = {};
    errors.oldValues = oldValues;

    if (!firstName || firstName.length === 0) {
        errors.firstNameErr = "Voornaam is verplicht!";
    } else if (!isNaN(firstName) || /\d/.test(firstName)) {
        errors.firstNameErr = "Voornaam moet bestaan uit letters!";
    } else {
        oldValues.firstName = firstName;
    }

    if (!lastName || lastName.length === 0) {
        errors.lastNameErr = "Achternaam is verplicht!";
    } else if (!isNaN(lastName) || /\d/.test(lastName)) {
        errors.lastNameErr = "Achternaam moet bestaan uit letters!";
    } else {
        oldValues.lastName = lastName;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailAddress || emailAddress.length === 0) {
        errors.emailAddressErr = "E-mailadres is verplicht!";
    } else if (!emailRegex.test(emailAddress)) {
        errors.emailAddressErr = "Vul een geldig e-mailadres in!";
    } else {
        oldValues.emailAddress = emailAddress;
    }

    if (req.session.user.activeRole == "client") {
        if (!phoneNumber || phoneNumber.length === 0) {
            errors.phoneNumberErr = "Telefoonnummer is verplicht!";
        } else if (!phone(phoneNumber, { country: "NL" }).isValid) {
            errors.phoneNumberErr = "Gebruik een geldig telefoonnummer";
        } else {
            oldValues.phoneNumber = phoneNumber;
        }

        if (!street || street.length === 0) {
            errors.streetErr = "Straat is verplicht!";
        } else if (!isNaN(street) || /\d/.test(street)) {
            errors.streetErr = "Straat moet bestaan uit letters!";
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

        if (!town || town.length === 0) {
            errors.townErr = "Plaats is verplicht!";
        } else if (!isNaN(town) || /\d/.test(town)) {
            errors.townErr = "Plaats moet bestaan uit letters!";
        } else {
            oldValues.town = town;
        }

        const postalCodeRegex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;

        if (!postalCode || town.postalCode === 0) {
            errors.postalCodeErr = "Postcode is verplicht!";
        } else if (!postalCodeRegex.test(postalCode)) {
            errors.postalCodeErr = "Vul een geldige postcode in!";
        } else {
            oldValues.postalCode = postalCode;
        }
    }

    (async () => {
        const userExists = await User.findOne({ emailAddress: emailAddress, _id: { $ne: req.session.user.userId } }).lean();
        if (userExists) {
            delete oldValues.emailAddress;
            errors.emailAddressErr = "E-mailadres is al in gebruik!";
        }

        if (typeof errors.firstNameErr != "undefined" || typeof errors.lastNameErr != "undefined" || typeof errors.emailAddressErr != "undefined" || typeof errors.phoneNumberErr != "undefined" || typeof errors.streetErr != "undefined" || typeof errors.houseNumberErr != "undefined" || typeof errors.houseNumberAdditionErr != "undefined" || typeof errors.townErr != "undefined" || (typeof errors.postalCodeErr != "undefined" && req.session.user.activeRole == "client")) {
            (async () => {
                const roleRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: { $ne: "Afgewezen" } });
                const roleProcessingRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: "In behandeling" });
                res.render("user_profile", { pageName: "Mijn profiel", session: req.session, ...errors, type, roleRequest, roleProcessingRequest });
            })();
        } else if (typeof errors.firstNameErr != "undefined" || typeof errors.lastNameErr != "undefined" || (typeof errors.emailAddressErr != "undefined" && req.session.user.activeRole != "client")) {
            (async () => {
                const roleRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: { $ne: "Afgewezen" } });
                const roleProcessingRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: "In behandeling" });
                res.render("user_profile", { pageName: "Mijn profiel", session: req.session, ...errors, type, roleRequest, roleProcessingRequest });
            })();
        } else {
            (async () => {
                const user = req.session.user;

                let updateInfo = {};

                if (user.activeRole == "client") {
                    updateInfo = { oldMail: user.emailAddress, firstName, lastName, emailAddress, phoneNumber, street, houseNumber, houseNumberAddition, town, postalCode };
                } else {
                    updateInfo = { oldMail: user.emailAddress, firstName, lastName, emailAddress };
                }

                await updateUserByEmail(updateInfo);
                user.firstName = firstName;
                user.lastName = lastName;
                user.emailAddress = emailAddress;

                if (user.activeRole == "client") {
                    user.phoneNumber = phoneNumber;
                    user.street = street;
                    user.houseNumber = houseNumber;
                    user.houseNumberAddition = houseNumberAddition;
                    user.town = town;
                    user.postalCode = postalCode;
                }

                return res.redirect("/user/profile?changedProfile=true");
            })();
        }
    })();
};

exports.changePassword = (req, res) => {
    const { currentPassword, newPassword, confirmPassword, type } = req.body;

    const errors = {};
    const oldValues = {};
    errors.oldValues = oldValues;

    (async () => {
        let oldPassword = await User.find({ _id: req.session.user.userId }, { _id: 0, password: 1 });
        oldPassword = oldPassword[0].password;

        if (!currentPassword || currentPassword.length === 0) {
            errors.currentPasswordErr = "Oude wachtwoord is verplicht!";
        } else if (!bcrypt.compareSync(currentPassword, oldPassword)) {
            errors.currentPasswordErr = "Het oude wachtwoord is niet correct!";
        } else {
            oldValues.oldPassword = currentPassword;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!newPassword || newPassword.length === 0) {
            errors.newPasswordErr = "Nieuwe wachtwoord is verplicht!";
        } else if (!passwordRegex.test(newPassword)) {
            errors.newPasswordErr = "Gebruik minimaal 8 letters, 1 hoofdletter en 1 cijfer!";
        }

        if (!confirmPassword || confirmPassword.length === 0) {
            errors.confirmPasswordErr = "Nieuwe wachtwoord bevestigen is verplicht!";
        } else if (!(confirmPassword == newPassword)) {
            errors.confirmPasswordErr = "De wachtwoorden komen niet overeen!";
        }

        if (typeof errors.currentPasswordErr != "undefined" || typeof errors.newPasswordErr != "undefined" || typeof errors.confirmPasswordErr != "undefined") {
            (async () => {
                const roleRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: { $ne: "Afgewezen" } });
                const roleProcessingRequest = await Request.find({ userId: req.session.user.userId, type: "addClientRole", status: "In behandeling" });
                res.render("user_profile", { pageName: "Mijn profiel", session: req.session, ...errors, type, roleRequest, roleProcessingRequest });
            })();
        } else {
            (async () => {
                await User.updateOne({ _id: req.session.user.userId }, { $set: { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync()), confirmPassword: bcrypt.hashSync(newPassword, bcrypt.genSaltSync()) } });
                return res.redirect("/logout");
            })();
        }
    })();
};

exports.requestRole = async (req, res) => {
    const userId = req.session.user.userId;

    const oldRequest = await Request.find({ userId: userId, type: "addClientRole", status: "Afgewezen" });

    if (oldRequest.length > 0) {
        const oldRequestId = oldRequest[0]._id;
        await Request.findOneAndUpdate({ _id: oldRequestId }, { $set: { requestDate: Date.now(), status: "In behandeling" } });
    } else {
        const request = new Request({
            userId: userId,
            type: "addClientRole",
        });

        request.save();
    }

    res.redirect("/user/profile?requestRole=true&rolesUpdate=true");

    const sendStatus = await notifyCoordinatorRequest(req, res, "addClientRole");

    if (sendStatus) {
        console.log("Coordinator notified (Add client role)");
    } else {
        console.log("Mail not send");
    }
};

exports.cancelRequestRole = async (req, res) => {
    const userId = req.session.user.userId;

    const request = await Request.find({ userId: userId, type: "addClientRole", status: "In behandeling" });

    if (request.length > 0) {
        const requestId = request[0]._id;
        await Request.findOneAndDelete({ _id: requestId });
    }

    res.redirect("/user/profile?rolesUpdate=true");
};

exports.switchActiveRole = async (req, res) => {
    const userId = req.session.user.userId;
    const activeRole = req.body.activeRole;

    await User.findOneAndUpdate({ _id: userId }, { $set: { activeRole: activeRole } });

    let session = req.session;
    session.user = {
        ...session.user,
        activeRole: activeRole,
    };

    return res.redirect("/");
};

exports.changeRoles = async (req, res) => {
    const userId = req.query.id;
    const clientRole = req.body.client;
    const memberRole = req.body.member;

    const userInfo = await User.findById({ _id: userId });

    if (typeof clientRole != "undefined" || typeof memberRole != "undefined") {
        if ("client" != userInfo.roles[0] && "client" != userInfo.roles[1]) {
            if (clientRole == "on") {
                await User.findOneAndUpdate({ _id: userId }, { $push: { roles: "client" } });

                const oldRequest = await Request.find({ userId: userId, type: "addClientRole" });

                if (oldRequest.length > 0) {
                    const oldRequestId = oldRequest[0]._id;
                    await Request.findOneAndUpdate({ _id: oldRequestId }, { $set: { status: "Goedgekeurd" } });
                } else {
                    const request = new Request({
                        userId: userId,
                        type: "addClientRole",
                        status: "Goedgekeurd",
                    });

                    request.save();
                }
            }
        } else {
            if (typeof clientRole == "undefined" || clientRole == "off") {
                await User.findOneAndUpdate({ _id: userId }, { $pull: { roles: "client" } });
                await Request.findOneAndDelete({ userId: userId, type: "addClientRole" });
                if (userInfo.activeRole == "client") {
                    await User.findOneAndUpdate({ _id: userId }, { $set: { activeRole: "member" } });
                }
            }
        }

        if ("member" != userInfo.roles[0] && "member" != userInfo.roles[1]) {
            if (memberRole == "on") {
                await User.findOneAndUpdate({ _id: userId }, { $push: { roles: "member" } });
            }
        } else {
            if (typeof memberRole == "undefined" || memberRole == "off") {
                await User.findOneAndUpdate({ _id: userId }, { $pull: { roles: "member" } });
                if (userInfo.activeRole == "member") {
                    await User.findOneAndUpdate({ _id: userId }, { $set: { activeRole: "client" } });
                }
            }
        }
    }

    res.redirect("/user");
};

exports.deleteMember = async (req, res) => {
    const memberId = req.query.id;
    let assignments = [];

    // Delete all the requests from the member
    await Request.deleteMany({ userId: memberId });

    // Delete the member from all assignments
    assignments = await Assignment.find({ isApproved: true });

    for await (let assignment of assignments) {
        for await (let victim of assignment.participatingLotusVictims) {
            if (victim._id == memberId) {
                await Assignment.updateOne({ _id: assignment._id }, { $pull: { participatingLotusVictims: { _id: memberId } } });

                if (assignment.amountOfLotusVictims === assignment.participatingLotusVictims.length) {
                    await Request.findOneAndUpdate({ assignmentId: assignment._id }, { $set: { status: "Openstaand" } });
                }
            }
        }
    }

    // Delete the member
    await User.findOneAndDelete({ _id: memberId });

    res.redirect("/user?deleteMember=true");
};

const updateUserByEmail = async (user) => {
    try {
        const { oldMail } = user;
        await User.updateOne({ emailAddress: oldMail }, { $set: { ...user } });
        return;
    } catch (err) {
        throw err;
    }
};

// Functionality for getting all the users
exports.getAllUsers = async () => {
    return await User.find();
};

exports.getAllValidClients = async () => {
    return await User.find({
        roles: {
            $not: {
                $elemMatch: {
                    $regex: "coordinator",
                },
            },
            $elemMatch: {
                $regex: "client",
            },
        },
    });
};

exports.getAllValidMembers = async () => {
    return await User.find({
        firstName: { $ne: "" },
        lastName: { $ne: "" },
        roles: {
            $not: {
                $elemMatch: {
                    $regex: "coordinator",
                },
            },
            $elemMatch: {
                $regex: "member",
            },
        },
    });
};

exports.getAllInvitedMembers = async () => {
    return await User.find({ firstName: "", lastName: "" });
};
