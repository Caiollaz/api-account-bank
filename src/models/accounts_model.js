var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var accounts = new Schema({
    username: String,
    password: String
});

module.exports = mongoose.model("Accounts", accounts);    