var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
var Group = require("../models/Group");

var middlewareObj = {};

//Middleware
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
	
}

module.exports = middlewareObj;