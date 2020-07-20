var mongoose = require("mongoose");

var groupSchema = new mongoose.Schema({
	name: String,
	desc: String,
	color: String
});

module.exports = mongoose.model("Group", groupSchema);