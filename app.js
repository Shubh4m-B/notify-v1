var express 	= require("express"),
	app 		= express(),
	bodyParser	= require("body-parser"),	
	mongoose	= require("mongoose"),
	Group		= require("./models/Group"),
	Task 		= require("./models/Task");

// var notes = [
// 	{
// 		name : "Note_1",
// 		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
// 		color : "#000000",
// 		task : [],
// 		history : []
// 	},
// 	{
// 		name : "Note_2",
// 		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
// 		color : "#000000",
// 		task : [],
// 		history : []
// 	},
// 	{
// 		name : "Note_3",
// 		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
// 		color : "#000000",
// 		task : [],
// 		history : []
// 	},
// 	{
// 		name : "Note_4",
// 		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
// 		color : "#000000",
// 		task : [],
// 		history : []
// 	}
// ]

mongoose.connect("mongodb://localhost/notify_v1", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//HOME PAGE
app.get("/", function(req,res){
	res.render("landing");
});

//INDEX ROUTE
app.get("/index", function(req,res){
	Group.find({}, function(err, allGroups){
		if(err){
			console.log("Something went wrong!");
		}
		else{
			res.render("index", {allGroups: allGroups});
		}
	})
});

//NEW NOTE GROUP ROUTE
app.get("/index/new", function(req, res){
	res.render("new");
});

//CREATE NOTE GROUP ROUTE
app.post("/index", function(req, res){
	Group.create(req.body.group, function(err, group){
		if(err){
			console.log("Something went Wrong!");
		}
		else{
			console.log("New Group Created");
			res.redirect("/index");
		}
	})
});

//SHOW NOTE GROUP ROUTE
app.get("/index/:id", function(req, res){
	Group.findById(req.params.id).populate("Task").exec(function(err, foundGroup){
		if(err){
			console.log("Something went wrong!!");
		}
		else{
			res.render("show", {foundGroup: foundGroup});
		}
	});
});

//NEW TASK ROUTE
app.get("/index/:id/task", function(req,res){
	Group.findById(req.params.id, function(err, foundGroup){
		if(err){
			console.log("Something went wrong!!");
			res.redirect("/index/" + req.params.id);
		}
		else{
			res.render("newTask", {foundGroup: foundGroup});
		}
	});
});

//CREATE NEW TASK
app.post("/index/:id", function(req, res){
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
					res.redirect("/index/" + group._id);
				}
			});
		}
	});
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("App has been started!");
});
	
