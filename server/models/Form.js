const {Schema, Types, model} = require("mongoose");

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    additionalInfo: { type: String }
});

module.exports = model("Form", schema);
