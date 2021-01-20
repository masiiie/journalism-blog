// getting-started.js
var mongoose = require('mongoose');
var uri = 'mongodb://127.0.0.1/my_database';
mongoose.connect(uri, {useNewUrlParser: true});



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`conectados a ${uri}`)
});


autor = require('./models/user')
post = require('./models/post')



console.log('Autores....')
autores = [
    {name1:'Santiago', apellido1: 'Mendez', apellido2: 'Urrutia', tipo: 'Autor'},
    {name1:'Jose', apellido1: 'Villar', apellido2: 'Garcia', tipo: 'Autor'},
    {name1:'Julio', apellido1: 'Perez', apellido2: 'Rosa', tipo: 'Público'},
    {name1:'Sandra', name2:'Cecilia', apellido1: 'Lula', apellido2: 'Guzman', tipo: 'Público'},
]

autor_schema = []

autores.forEach(function(p) {
    sv = new autor(p)
    autor_schema.push(sv)
    sv.save(function (err, p) {
        if (err) return console.error(err);
        console.log(`salvando autor = ${p}`)
    });
}, this);


id = '5fb32bf12ab45703dc997586' //new mongoose.Types.ObjectId('5fb32bf12ab45703dc997586')


console.log('Posts.....')
posts = [
    {tipo:'Actualidad', titulo: 'Su gran amor', autor: id, fecha: new Date(1995, 11, 17), contenido: 'ajaj'},
    {tipo:'Juventud cristiana', titulo: 'Su misericordia', autor: id, fecha: new Date(1995, 11, 17), contenido: 'ajaj'},
    {tipo:'Historia bíblica', titulo: 'Siempre vivo', autor: id, fecha: new Date(1995, 11, 17), contenido: 'ajaj'},
    {tipo:'Actualidad', titulo: 'Amor eterno', autor: id, fecha: new Date(1995, 11, 17), contenido: 'ajaj'},
    {tipo:'Actualidad', titulo: 'El paraiso', autor: id, fecha: new Date(1995, 11, 17), contenido: 'ajaj'},
    {tipo:'Historia bíblica', titulo: 'Adan y eva', autor: id, fecha: new Date(1995, 11, 17), contenido: 'ajaj'},
    {tipo:'Entrevista', titulo: 'Los pecados capitales', autor: id, fecha: new Date(1995, 11, 17), 
    contenido: 'ajaj', entrevistado: {name1: 'Juan', name2: '', lastname1: 'Guzman', lastname2: 'Martinez'}},
    {tipo:'Entrevista', titulo: 'La iniquidad', autor: id, fecha: new Date(1995, 11, 17), contenido: 'ajaj',
    entrevistado: {name1: 'Pepe', name2: 'Luis', lastname1: 'Perez', lastname2: 'Villa'}},
]

posts.forEach(function(p) {
    sv = new post(p)
    sv.save(function (err, p) {
        if (err) return console.error(err);
        console.log(`salvando post = ${p}`)
    });
}, this);


const gracefulShutdown = (msg, callback) =>{
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback()
    })
}

// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0)
    })
})