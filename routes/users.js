var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var User = require("../models/User");
var Group = require("../models/Group");

//ADD USER ROUTE
router.post("/index/:id/add", function(req, res){
	User.findOne({username: req.body.username}, function(err, foundUser){
		// console.log(foundUser);
		if(err){
			console.log(err);
			res.redirect("/index/" + req.params.id + "/show");
		}
		else if(foundUser === null){
			req.flash("danger", "User does not exist!");
			res.redirect("/index/" + req.params.id + "/show");
		}
		else{
			Group.findById(req.params.id, function(err, foundGroup){
				if(err){
					console.log(err);
					res.redirect("/index/" + req.params.id + "/show");
				}
				
				else{
					var found = false;
					console.log(foundGroup.owner);
					console.log(foundUser.username);
					for(var i = 0; i< foundGroup.User.length; i++){
						if(foundGroup.User[i]._id.equals(foundUser._id) || (req.user.username === foundUser.username)){
							found = true;
						}
					}
					if(found === true){
						console.log("User already a member!")
						req.flash("danger", "User already a member!");
						res.redirect("/index/" + req.params.id + "/show");
					}
					else{
						foundGroup.User.push(foundUser);
						foundGroup.save();
						foundUser.Group.push(foundGroup);
						foundUser.save();
						// console.log(foundUser);
						console.log("User Added");
						req.flash("success", "Member added");
						res.redirect("/index/" + req.params.id + "/show");
					}
				}
			});
		}
	});
});

//REMOVE USER ROUTE
router.get("/index/:id/remove/:userId", function(req,res){
	Group.findById(req.params.id, function(err, foundGroup){
		if(err){
			console.log("Error in finding the group!");
			console.log(err);
			res.redirect("/index/:id/show");
		}
		else{
			User.findById(req.params.userId, function(err, foundUser){
				if(err){
					console.log(err);
					res.redirect("/index/:id/show");
				}
				else{
					const userIndex = foundGroup.User.indexOf(foundUser);
					console.log(userIndex);
					// foundGroup.User.splice(userIndex,1);
					// foundGroup.save();
					
					const groupIndex = foundUser.Group.indexOf(foundGroup);
					console.log(groupIndex);
					// foundUser.Group.splice(groupIndex,1);
					// foundUser.save();
					
					console.log("User removed");
					res.redirect("/index/" + req.params.id + "/show");
				}
			})
		}
	})
});

module.exports = router;