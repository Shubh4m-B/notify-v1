var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
	name: String,
	desc: String,
	color: String,
	deadline : String
});

module.exports = mongoose.model("Task", taskSchema);