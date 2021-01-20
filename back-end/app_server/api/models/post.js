//Require Mongoose
var mongoose = require('mongoose');
var usermodel = require('./user')

//Define a schema
var Schema = mongoose.Schema;

var Post = new Schema({
  autor:
  {
    type: String, 
    required: true,
    validate: {validator: validateautor, msg: "Ese usuario no es autor o no existe."}
  },

  /*
  entrevistado: //{type: {name1: String, name2: String, lastname1: String, lastname2: String}},
  {
    type: Schema.Types.ObjectId, 
    ref: "User", 
    default: null
  },
  */
  
  entrevistado: //{type: {name1: String, name2: String, lastname1: String, lastname2: String}},
  {
    type: String,
    default: ''
  },


  fecha: 
    {
      type: Date, 
      required: true, 
      default: Date.now(),
      validate: {validator: validatefecha, msg: 'La fecha de publicacion no puede ser posterior al dia de hoy.'}
    },
  
  tipo: { 
    type: String, 
    enum: ['Entrevista', 'Actualidad','Juventud cristiana', 'Historia bíblica'], 
    required: true,
    validate: {validator: validatetipo, msg: "Incongruencia con el tipo"}},
  
  titulo: { type: String, required: true},

  fotos: {type: [String], default: []}, 

  tags: {type: [String], default: []},

  comments: {
    type: [{ body: String, date: Date, user: String }], 
    default: []
  },

  //likes: [Schema.Types.ObjectId],

  reacciones : {
    type: [{ 
      user: String, 
      //valor : {enum: ["Me gusta", "Me encanta","Me ha hecho reflexionar", "Me confunde", "Me he quedado asombrado", "No lo creo"]} 
      valor: String
    }], 
    default: []
  }, 

  contenido : {type: String, required : true},
  frase: {
    type: String,
    default: '',
    validate: {validator: validatefrase, msg: "Esta frase no aparece en el contenido del articulo"}
  },
  visitas: {type: Number, default: 0},
  visitantes: {type: [String], default: []}
});

function validatefrase(frase){
  return this.contenido.includes(frase)
}

function validatetipo(tipo){
  console.log(`Validando tipo!`)
  if(tipo == 'Entrevista' && this.entrevistado=='') return false
  if(tipo != 'Entrevista' && this.entrevistado!='') return false
  console.log('La validacion de tipo dio bien!!')
  return true
}

function validatefecha(fecha){
  console.log(`Validando fecha!`)
  return fecha <= Date.now()
}

async function validateautor(autor){
  console.log(`Validando autor!`)
  var promise = await
  //usermodel.findById(autor)
  usermodel.findById(new mongoose.Types.ObjectId(autor))
  .exec((err, user) => {
    if(!user){
      console.log('Usuario no encontrado')
      return false
    }
    else 
    
    if(err){
      console.log(`mira el error ${err}`)
    return false
    }
    else 

    if(user.tipo != "Autor" && user.tipo != "Admin"){
      console.log('Este usuario no es autor')
      return false
    } 
    else

    if(autor == this.entrevistado){
      console.log('El autor y el entrevistado no pueden ser la misma persona')
      return false
    }
    else 

    if(this.entrevistado != ''){
      usermodel.findById(new mongoose.Types.ObjectId(this.entrevistado))
      .exec((err2, entr) => {
        if(!entr){
          console.log('Ese persona entrevistada no existe')
          return false
        }
        else 

        if(err2){
          console.log(`Error interno, mira ${err2}`)
          return false
        }

      })
    }
    else 

    return true
  })
  //.then()

}

var postmodel = mongoose.model('Post', Post);


//Export function to create "SomeModel" model class
module.exports = postmodel