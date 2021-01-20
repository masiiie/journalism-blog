//Require Mongoose
var mongoose = require('mongoose');
var crypto = require('crypto')
var jwt = require('jsonwebtoken')

//Define a schema
var Schema = mongoose.Schema;

var User = new Schema({
  //name: {type: {first: String, last: String}, required: true, unique: true},
  name1: { type: String, required: true},
  name2: { type: String},
  apellido1: { type: String, required: true},
  apellido2: { type: String, required: true},
  //foto: {type: Schema.Types.Buffer},
  foto: String, // el id d la galeria
  // para enviarle notificaciones de que 
  //hay un nuevo post si esta suscrito
  correo: {
    type: String, 
    unique: true, // dos usuarios no me pueden poner el mismo correo
    validate: { validator: validatecorreo, msg: 'Formato de correo incorrecto'} },
  tipo: { 
    type: String, 
    enum: ['Autor', 'Público','Admin'],  // a los autores no voy a permitirles comentar, ni like 
    required: true}, // ni tampoco se les envia nada al correo
  hash: String,
  salt: String
});

function validatecorreo(correo){
  if(correo && !(correo.endsWith('@gmail.com') || correo.endsWith('@outlook.com') || correo.endsWith('@nauta.cu'))){
    return false
  }
  return true
}

User.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
  .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
  .toString('hex')
}

User.methods.validPassword = function (password) {
  const hash = crypto
  .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
  .toString('hex')
  return this.hash == hash
}

User.methods.generateJWT =  function () {
  const expiry =  new Date()
  expiry.setDate(expiry.getDate() + 7)
  return jwt.sign({
    _id: this._id,
    correo: this.correo,
    name: `${this.name1} ${this.name2} ${this.apellido1} ${this.apellido2}`,
    exp: parseInt(expiry.getTime()/1000, 10), 
    tipo: this.tipo,
    foto: this.foto
  }, process.env.JWT_SECRET)
}

var usermodel = mongoose.model('User', User)

//Export function to create "SomeModel" model class
module.exports = usermodel  