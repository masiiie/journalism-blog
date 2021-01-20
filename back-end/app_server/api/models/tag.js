//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;


var Tag = new Schema({
  name: { type: String, required: true, unique: true},
});


//Export function to create "SomeModel" model class
module.exports = mongoose.model('Tag', Tag);