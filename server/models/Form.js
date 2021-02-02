const {Schema, model} = require("mongoose");

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    birthDate: { type: Date, required: true },
    social: { type: String, required: true },
    job: { type: String, required: true },
    position: { type: String, required: true },
    goal: { type: String, required: true },
    additionalInfo: { type: String }
});

module.exports = model("Form", schema);
