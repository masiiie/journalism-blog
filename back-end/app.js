//require('dotenv').load()
require('dotenv').config({path:'./.env.txt'});
var passport =  require('passport')


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


require('./app_server/api/db')
require('./app_server/api/config/passport')

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var apirouter = require('./app_server/api/router')

var app = express();

// view engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'pug');


app.use(passport.initialize())
app.use((err, req, res, next) => {
  if(err.name === 'UnauthorizedError'){
    res.status(401)
    .json({'message': err.name + ': ' + err.message})
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apirouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;