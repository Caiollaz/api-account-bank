var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var transfers = new Schema({
    type: String,
    origin: String,
    destination: String,
    amount: Number
});

module.exports = mongoose.model("Transfers", transfers);    