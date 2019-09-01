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
var User = require('./app/models/user'); // Mongoose users model

//----------------------------------------------------------------------------------
const port = process.env.PORT || 1111;
mongoose.connect(config.database); // Connect to db
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
//Authentication - No Middleware needed
apiRoutes.post('/authenticate', function(req, res){
	var username = req.body.username;
	var enteredPassword = req.body.password;

	User.findOne({username:username}, function(err, users){
		if(err){
			res.send("Request error");
		}
		if(users){
		bcrypt.compare(enteredPassword, users.password, function(err, resp) {
			if(resp===true){
				const payload = {
					/* _id: users.id, */
					username: users.username,
					firstname: users.firstname,
					lastname: users.lastname,
					admin: users.admin
				};

				
				var token = jwt.sign(payload, app.get('superSecret'), {
					expiresIn : 60*60*24 //24 hours valid token
				});
				res.setHeader("x-access-token", token);
				res.send({
					success: true,
					message: 'Successfully Logged in!',
					admin:payload.admin,
          			token: token
				});

				
			}else{
				res.send({
					success: false,
					message: "Wrong password"
				})
			}
		});
		}else{
			res.send({
				user: false
			})
		}
	});
});

//----------------------------------------------------------------------------------
//Authenticated routes

//Create new user
apiRoutes.post('/users', function(req, res){
	var username = req.body.username;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var phoneNumber = req.body.phoneNumber;
	var country = req.body.country;
	var company = req.body.company;
	var position = req.body.position;
	var imageUrl = req.body.imageUrl;

	var admin = false;
	if(req.body.role == "Admin"){
		admin = true;
	}

  
	  bcrypt.hash(req.body.password, 10, function(err, hash) {
		  var user = new User({username: username, password: hash, firstname: firstname, lastname: lastname, email:email, phoneNumber: phoneNumber, country:country, company:company, position:position, imageUrl:imageUrl, admin: admin});
		  User.create(user, function(err, users){
			  if(err)
				  res.send(err);
			  res.json(users);
		  });
	  });
  });

  


//----------------------------------------------------------------------------------
app.use('/api', apiRoutes);
//----------------------------------------------------------------------------------

//Start server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
