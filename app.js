var express 			= require("express"),
	app 				= express(),
	bodyParser			= require("body-parser"),	
	mongoose			= require("mongoose"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	passLocalMongoose	= require("passport-local-mongoose"),
	methodOverride		= require("method-override"),
	flash				= require("connect-flash"),
	
	User				= require("./models/User"),
	Group				= require("./models/Group"),
	Task 				= require("./models/Task");

mongoose.connect("mongodb://localhost/notify_v2", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "hello, This is notify_v1",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.danger = req.flash("danger");
	res.locals.warning = req.flash("warning");
	res.locals.success = req.flash("success");
	next();
});

//HOME PAGE
app.get("/", function(req,res){
	res.render("landing");
});

//INDEX ROUTE
app.get("/index", isLoggedIn, function(req,res){
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

//NEW NOTE GROUP ROUTE
app.get("/index/new", isLoggedIn, function(req, res){
	res.render("Group/new");
});

//CREATE NOTE GROUP ROUTE
app.post("/index", isLoggedIn, function(req, res){
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
					req.flash("success", "Note Group Created");
					res.redirect("/index");
				}
			});
		}
	});
});

//SHOW NOTE GROUP ROUTE
app.get("/index/:id/show", isLoggedIn, function(req, res){
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
app.put("/index/:id", isLoggedIn, function(req, res){
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
app.delete("/index/:id", isLoggedIn, function(req, res){
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

//Add USER ROUTE
app.post("/index/:id/add", function(req, res){
	User.findOne({username: req.body.username}, function(err, foundUser){
		// console.log(foundUser);
		if(err){
			console.log(err);
			// console.log("Something went wrong in post add user!");
			res.redirect("/index/" + req.params.id + "/show");
		}
		else if(foundUser === null){
			req.flash("danger", "User does not exist!");
			console.log("User not found!");
			res.redirect("/index/" + req.params.id + "/show");
		}
		else{
			Group.findById(req.params.id, function(err, foundGroup){
				// console.log(foundGroup);
				if(err){
					// console.log("Something went wrong during finding!");
					console.log(err);
					res.redirect("/index/" + req.params.id + "/show");
				}
				
				else{
					var found = false;
					for(var i = 0; i< foundGroup.User.length; i++){
						if(foundGroup.User[i]._id.equals(foundUser._id) || (foundGroup.owner === foundUser.username)){
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



//CREATE NEW TASK
app.post("/index/:id", isLoggedIn, function(req, res){
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
app.get("/index/:id/task/:taskId/edit", isLoggedIn, function(req, res){
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
app.put("/index/:id/task/:taskId", isLoggedIn, function(req, res){
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
app.delete("/index/:id/task/:taskId", isLoggedIn, function(req, res){
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

//Authentication ROUTES

//Register Routes

//Register Form
app.get("/register", function(req, res){
	res.render("Auth/register");
});

//Register Logic
app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("warning", "Oops....Try another username!");
			console.log("Something went wrong!");
			console.log(err);
			return res.render("Auth/register");
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
app.get("/login", function(req, res){
	res.render("Auth/login");
});

//Login Logic
app.post("/login", passport.authenticate("local", {
		successRedirect: "/index", 
		failureRedirect:"/login"
	}), function(req, res){
});

//Logout Logic
app.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Succesfully logged out");
	res.redirect("/");
});

//Middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("App has been started!");
});
	
