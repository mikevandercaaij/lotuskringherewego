const mongoose = require("./../../database/dbconnection");
const bcrypt = require("bcrypt");
const { phone } = require("phone");

// Create userSchema with all fields
exports.userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Voornaam is verplicht!"],
    },
    lastName: {
        type: String,
        required: [true, "Achternaam is verplicht!"],
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (v) {
                const validNumber = phone(v, { country: "NL" });
                return validNumber.isValid;
            },
            message: `Gebruik een geldig telefoonnummer`,
        },
        required: [true, "Telefoonnummer is verplicht!"],
    },
    emailAddress: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: `Gebruik een geldig e-mailadres zoals j.doe@gmail.com!`,
        },
        required: [true, "E-mailadres is verplicht!"],
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v);
            },
            message: `Gebruik minimaal 8 letters, 1 hoofdletter en 1 cijfer!`,
        },
        required: [true, "Wachtwoord is verplicht!"],
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function (v) {
                return v == this.password;
            },
            message: `De wachtwoorden komen niet overeen!`,
        },
        required: [true, "Bevestig wachtwoord is verplicht!"],
    },
    street: {
        type: String,
        required: [true, "Straat is verplicht!"],
    },
    houseNumber: {
        type: Number,
        required: [true, "Huisnummer is verplicht!"],
    },
    houseNumberAddition: {
        type: String,
    },
    postalCode: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(v);
            },
            message: `Gebruik een geldig postcode zoals 2973FD!`,
        },
        required: [true, "Postcode is verplicht!"],
    },
    town: {
        type: String,
        required: [true, "Plaats is verplicht!"],
    },
    roles: {
        type: [String],
        enum: ["coordinator", "client", "member"],
        required: [true, "Minstens één rol verplicht!"],
    },
    activeRole: {
        type: [String],
        enum: ["coordinator", "client", "member"],
        required: [true, "Minstens één rol verplicht!"],
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    lastLoginDate: {
        type: Date,
    },
});
// Hash password before saving user
exports.userSchema.pre("save", function () {
    let user = this;
    // Hash password if password isn't empty
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
    user.confirmPassword = bcrypt.hashSync(user.confirmPassword, bcrypt.genSaltSync());
});
// Create a User model
exports.userModel = mongoose.model("User", exports.userSchema);
