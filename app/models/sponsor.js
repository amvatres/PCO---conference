//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var SponsorModelSchema = new Schema({
    company:String,
    companyDescription: String,
    logoUrl: String,
    typeOfSponsorship: String,
    contactEmail: String,
    accepted:Boolean
});

//Export function to create "User" model class
module.exports = mongoose.model('Sponsor', SponsorModelSchema );