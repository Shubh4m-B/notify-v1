var mongoose = require("mongoose");

var groupSchema = new mongoose.Schema({
	name: String,
	desc: String,
	color: String,
	owner: String,
	User: [
		{
			type: mongoose.Schema.Types.ObjectId,
         	ref: "User"
		}
	],
	Task: [
		{
			type: mongoose.Schema.Types.ObjectId,
         	ref: "Task"
		}
	]
});

module.exports = mongoose.model("Group", groupSchema);