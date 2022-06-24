const mongoose = require("../../database/dbconnection");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { assignmentSchema } = require("./assignment.model");

// Create requestSchema with all fields
const requestSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
    },
    assignmentId: {
        type: ObjectId,
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Afgewezen", "In behandeling", "Goedgekeurd", "Openstaand", "Compleet"],
        default: "In behandeling",
    },
    type: {
        required: true,
        type: String,
        enum: ["createAssignment", "enrollment", "cancelEnrollment", "deleteAssignment", "updateAssignment", "addClientRole"],
    },
    updatedAssignment: assignmentSchema,
});
// Create a Request model
module.exports = mongoose.model("Request", requestSchema);
