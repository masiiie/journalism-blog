const passport = require('passport')
const LocalStrategy =  require('passport-local').Strategy
const mongoose = require('mongoose')
var User = mongoose.model('User')


passport.use(new LocalStrategy({
    usernameField:'correo'
}, 
(username, password, done) => {
    User.findOne({correo: username}, (err, user) => {
        if(err) return done(err)
        if(!user) {
            return done(null, false, {
                message: 'Incorrect username'
            })
        }

        if(!user.validPassword(password)) {
            return done(null, false, {
                message: 'Incorrect password'
            })
        }

        return done(null, user)
    })
}))