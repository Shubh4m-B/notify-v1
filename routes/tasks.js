var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var middleware = require("../middleware");
var Group = require("../models/Group");
var Task = require("../models/Task");

//CREATE NEW TASK
router.post("/index/:id", middleware.isLoggedIn, function(req, res){
	Group.findById(req.params.id, function(err, group){
		if(err){
			console.log("Something went wrong!!");
			res.redirect("/index");
		}
		else{
			Task.create(req.body.task, function(err, task){
				if(err){
					console.log("Something went wrong!");
					res.redirect("/index");
				}
				else{
					group.Task.push(task);
					group.save();
					req.flash("success", "Task added");
					res.redirect("/index/" + group._id +"/show");
				}
			});
		}
	});
});

//EDIT TASK ROUTE
router.get("/index/:id/task/:taskId/edit", middleware.isLoggedIn, function(req, res){
	Group.findById(req.params.id, function(err, foundGroup){
		if(err){
			
		}
		else{
			Task.findById(req.params.taskId, function(err, foundTask){
				if(err){
					console.log("Something went wrong!");
					res.redirect("/index");
				}
				else{
					res.render("Task/editTask", {foundGroup: foundGroup, foundTask: foundTask});
				}
			});
		}
	});
});

//UPDATE TASK ROUTE
router.put("/index/:id/task/:taskId", middleware.isLoggedIn, function(req, res){
	Task.findByIdAndUpdate(req.params.taskId, req.body.task, function(err, foundTask){
		if(err){
			console.log("Something went wrong!");
			res.redirect("/index");
		}
		else{
			req.flash("success", "Task updated");
			res.redirect("/index/" + req.params.id + "/show");
		}
	});
});

//DELETE TASK ROUTE
router.delete("/index/:id/task/:taskId", middleware.isLoggedIn, function(req, res){
	Task.findByIdAndDelete(req.params.taskId, function(err){
		if(err){
			console.log("Something went wrong!");
			res.redirect("/index/" + req.params.id + "/show");
		}
		else{
			req.flash("danger", "Task deleted");
			console.log("Task deleted");
			res.redirect("/index/" + req.params.id + "/show");
		}
	})
});

module.exports = router;