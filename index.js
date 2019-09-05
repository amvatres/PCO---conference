//----------------------------------------------------------------------------------
//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // Get configurations


//----------------------------------------------------------------------------------
//Models
var Tickets = require('./app/models/ticket'); // Mongoose employees model
var Conference = require('./app/models/conference'); // Mongoose employees model
var Messages = require('./app/models/message'); // Mongoose employees model
var Speakers = require('./app/models/speaker'); // Mongoose employees model
var Sponsors = require('./app/models/sponsor'); // Mongoose employees model


//----------------------------------------------------------------------------------
const port = process.env.PORT || 1111;
mongoose.connect(config.livedb); // Connect to db
//----------------------------------------------------------------------------------
//Uses
app.set('superSecret', config.secret); // secret variable
app.use(express.static(__dirname + '/app')); // client side
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//----------------------------------------------------------------------------------
//Routes
app.get('/', function (req, res) {
	res.sendFile('index.html');
});

//----------------------------------------------------------------------------------
//Get an instance of the router for api routes
var apiRoutes = express.Router();

//----------------------------------------------------------------------------------
//Authenticated routes
  apiRoutes.post('/tickets', function(req, res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var type=req.body.type;


	var ticket = new Tickets({firstname:firstname, lastname:lastname, email:email, type:type });
	Tickets.create(ticket, function(err, ticket){
		if(err)
			res.send(err);
		res.json(ticket);
		});
	});

//----------------------------------------------------------------------------------
	apiRoutes.get('/conference', function(req, res){
		Conference.find(function(err, conference){
		  if(err)
			res.send(err);
		  res.json(conference);
		})
	});
//----------------------------------------------------------------------------------
	apiRoutes.post('/messages', function(req, res){
		var name = req.body.name;
		var email = req.body.email;
		var subject=req.body.subject;
		var message=req.body.message;

		var message = new Messages({name:name, email:email, subject:subject, message:message });
		Messages.create(message, function(err, message){
			if(err)
				res.send(err);
			res.json(message);
		});
	});
//----------------------------------------------------------------------------------
	apiRoutes.get('/speakers', function(req, res){
		Speakers.find(function(err, speakers){
		if(err)
			res.send(err);
		res.json(speakers);
		})
	});

	apiRoutes.get('/speakers/:id', function(req, res){
		Speakers.findOne({_id:req.params.id}, function(err, speaker){
			if(err)
				res.send(err);
			res.json(speaker);
		});
	});
//----------------------------------------------------------------------------------
	apiRoutes.post('/sponsors', function(req, res){
		var company = req.body.company;
		var companyDescription = req.body.companyDescription;
		var contactEmail = req.body.contactEmail;
		var logoUrl=req.body.logoUrl;
		var typeOfSponsorship=req.body.typeOfSponsorship;
		var accepted=false;

		var sponsor = new Sponsors({company:company, companyDescription:companyDescription, contactEmail:contactEmail, logoUrl:logoUrl,typeOfSponsorship:typeOfSponsorship, accepted:accepted  });
		Sponsors.create(sponsor, function(err, sponsor){
			if(err)
				res.send(err);
			res.json(sponsor);
			});
		});


		apiRoutes.get('/sponsors', function(req, res){
			Sponsors.find({accepted: true }, function(err, sponsors){
			if(err)
				res.send(err);
			res.json(sponsors);
			})
		});
//----------------------------------------------------------------------------------

	
//----------------------------------------------------------------------------------
app.use('/api', apiRoutes);
//----------------------------------------------------------------------------------

//Start server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
