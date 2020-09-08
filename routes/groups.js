var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var middleware = require("../middleware");
var User = require("../models/User");
var Group = require("../models/Group");

//NEW NOTE GROUP ROUTE
router.get("/index/new", middleware.isLoggedIn, function(req, res){
	res.render("Group/new");
});

//CREATE NOTE GROUP ROUTE
router.post("/index", middleware.isLoggedIn, function(req, res){
	User.findById(req.user.id, function(err, user){
		if(err){
			console.log("Something went wrong in create note!");
			res.redirect("/index");
		}
		else{
			Group.create({
					name: req.body.group.name,
					desc: req.body.group.desc,
					color: req.body.group.color,
					owner: user.username
				}, function(err, group){
				
				if(err){
					// console.log("Something went wrong create note!!")
					res.redirect("/index");
				}
				else{
					user.Group.push(group);
					user.save();
					group.User.push(user);
					group.save();
					req.flash("success", "Note Group Created");
					res.redirect("/index");
				}
			});
		}
	});
});

//SHOW NOTE GROUP ROUTE
router.get("/index/:id/show", middleware.isLoggedIn, function(req, res){
	Group.findById(req.params.id).populate("Task").populate("User").exec(function(err, foundGroup){
		if(err){
			console.log("Something went wrong in show route!!");
			console.log(err);
		}
		else{
			res.render("Group/show", {foundGroup: foundGroup});
		}
	});
});

//UPDATE GROUP ROUTE
router.put("/index/:id", middleware.isLoggedIn, function(req, res){
	Group.findByIdAndUpdate(req.params.id, req.body.group, function(err){
		if(err){
			console.log("Something went wrong in update group!!")
		}
		else{
			console.log("Group Updated");
			req.flash("success", "Group Updated");
			res.redirect("/index/" + req.params.id + "/show");
		}
	})
});

//DELETE GROUP ROUTE
router.delete("/index/:id", middleware.isLoggedIn, function(req, res){
	Group.findByIdAndDelete(req.params.id, function(err){
		if(err){
			console.log("Something went wrong in delete group!!")
		}
		else{
			console.log("Group Deleted");
			req.flash("danger", "Note Group Deleted");
			res.redirect("/index");
		}
	})
});

module.exports = router;