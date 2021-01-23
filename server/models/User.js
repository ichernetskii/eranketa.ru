const {Schema, Types, model} = require("mongoose");

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    rights: { type: Array, required: true, default: [] }
});

module.exports = model("User", schema);
