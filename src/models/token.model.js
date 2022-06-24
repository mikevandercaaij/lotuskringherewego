const mongoose = require("../../database/dbconnection");

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
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
});
// Create a Token model
module.exports = mongoose.model("Token", tokenSchema);
