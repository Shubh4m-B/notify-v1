var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	Group: [
		{
			type: mongoose.Schema.Types.ObjectId,
         	ref: "Group"
		}
	]
});

module.exports = mongoose.model("User", userSchema);