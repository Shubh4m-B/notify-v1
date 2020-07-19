var express 	= require("express"),
	app 		= express(),
	bodyParser	= require("body-parser");	

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req,res){
	res.render("landing");
});

app.get("/index", function(req,res){
	res.render("index");
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("App has been started!");
});
	
