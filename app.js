var express 			= require("express"),
	app 				= express(),
	bodyParser			= require("body-parser"),	
	mongoose			= require("mongoose"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	passLocalMongoose	= require("passport-local-mongoose"),
	methodOverride		= require("method-override"),
	
	User				= require("./models/User"),
	Group				= require("./models/Group"),
	Task 				= require("./models/Task");

mongoose.connect("mongodb://localhost/notify_v1", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "hello, I am great",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
	res.render("Group/new");
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
			res.render("Group/show", {foundGroup: foundGroup});
		}
	});
});

//EDIT GROUP ROUTE
app.get("/index/:id/edit", function(req, res){
	Group.findById(req.params.id, function(err, foundGroup){
		if(err){
			console.log("Something went wrong!!");
		}
		else{
			res.render("Group/edit", {foundGroup: foundGroup});
		}
	});
});

//UPDATE GROUP ROUTE
app.put("/index/:id", function(req, res){
	Group.findByIdAndUpdate(req.params.id, req.body.group, function(err){
		if(err){
			console.log("Something went wrong!!")
		}
		else{
			console.log("Group Updated");
			res.redirect("/index/" + req.params.id);
		}
	})
});
//DELETE GROUP ROUTE
app.delete("/index/:id", function(req, res){
	Group.findByIdAndDelete(req.params.id, function(err){
		if(err){
			console.log("Something went wrong!!")
		}
		else{
			console.log("Group Deleted");
			res.redirect("/index");
		}
	})
});

//NEW TASK ROUTE
app.get("/index/:id/task", function(req,res){
	Group.findById(req.params.id, function(err, foundGroup){
		if(err){
			console.log("Something went wrong!!");
			res.redirect("/index/" + req.params.id);
		}
		else{
			res.render("Task/newTask", {foundGroup: foundGroup});
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


//EDIT TASK ROUTE
//UPDATE TASK ROUTE
//DELETE TASK ROUTE

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("App has been started!");
});
	
