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

var groupRoutes		= require("./routes/groups.js"),
	taskRoutes		= require("./routes/tasks.js"),
	indexRoutes		= require("./routes/index.js"),
	userRoutes 		= require("./routes/users.js");

var url = process.env.DatabaseURL||"mongodb://localhost/notify_v2";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
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

app.use(groupRoutes);
app.use(taskRoutes);
app.use(indexRoutes);
app.use(userRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("App has been started!");
});
