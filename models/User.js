var mongoose 			= require("mongoose"),
	passLocalMongoose 	= require("passport-local-mongoose");

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

userSchema.plugin(passLocalMongoose);

module.exports = mongoose.model("User", userSchema);