//Import the mongoose module
var mongoose = require('mongoose');
require('./models/post')
require('./models/tag')
require('./models/user')
require('./models/gallery')

/*
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
*/

//Set up default mongoose connection
var dburi = 'mongodb://127.0.0.1/my_database';
mongoose.connect(dburi, 
    { useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false, 
        //promiseLibrary: require('bluebird'),
        useNewUrlParser: true,
        useCreateIndex: true })
    .then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR", err);
})

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'dburi connection error:'));
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dburi}`)
})

mongoose.connection.on('disconnected', () => {
    console.log(`Mongoose disconnected`)
})


const gracefulShutdown = (msg, callback) =>{
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback()
    })
}

// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2')
    })
})


// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0)
    })
})

// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0)
    })
})