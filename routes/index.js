var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var passport = require("passport");

var middleware = require("../middleware");
var User = require("../models/User");
var Group = require("../models/Group");

//=========
//ROOT AND INDEX ROUTES
//=========

//HOME PAGE
router.get("/", function(req,res){
	res.render("landing");
});

//INDEX ROUTE
router.get("/index", middleware.isLoggedIn, function(req,res){
	// console.log(req.user.username);
	User.findById(req.user.id).populate("Group").exec(function(err, foundUser){
		if(err){
			console.log("Something went wrong in index route!!");
		}
		else{
			res.render("index", {user: foundUser});
		}
	});
});

// ==========
// AUTH ROUTES
// ==========

//Register Routes

//Register Form
router.get("/register", function(req, res){
	res.render("Auth/register");
});

//Register Logic
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("warning", "Try another username, this username already exists!");
			res.redirect("/register");
		}
		
		passport.authenticate("local")(req, res, function(){
			console.log("Signed in successfully!");
			req.flash("success", "Signed up successfully");
			res.redirect("/index");
		})
	});
});

//Login Routes

//Login Form
router.get("/login", function(req, res){
	res.render("Auth/login");
});

//Login Logic
router.post("/login", passport.authenticate("local", {
		successRedirect: "/index", 
		failureRedirect:"/login"
	}), function(req, res){
});

//Logout Logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Succesfully logged out");
	res.redirect("/");
});

module.exports = router;