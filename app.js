var express 	= require("express"),
	app 		= express(),
	bodyParser	= require("body-parser");	

var notes = [
	{
		name : "Note_1",
		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		color : "#000000",
		task : [],
		history : []
	},
	{
		name : "Note_2",
		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		color : "#000000",
		task : [],
		history : []
	},
	{
		name : "Note_3",
		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		color : "#000000",
		task : [],
		history : []
	},
	{
		name : "Note_4",
		desc : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		color : "#000000",
		task : [],
		history : []
	}
]

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req,res){
	res.render("landing");
});

app.get("/index", function(req,res){
	res.render("index", {notes: notes});
});

app.get("/index/new", function(req, res){
	res.render("new");
});

app.post("/index", function(req, res){
	var name = req.body.group.name;
	var desc = req.body.group.desc;
	var color = req.body.group.color;
	
	var group = {name: name, desc:desc, color:color, task:[], history:[]};
	notes.push(group);
	res.render("index", {notes: notes});
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("App has been started!");
});
	
