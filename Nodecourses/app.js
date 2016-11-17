var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
mongoose.connect('mongodb://desss:techno@ds027175.mlab.com:27175/udemy3');

var routes = require('./routes/index');
var users = require('./routes/users');
var courses = require('./routes/courses');
var about = require('./routes/about');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use session amd multer
app.use(session({secret:'max', saveUninitialized:false, resave:true}));
app.use(multer({dest:__dirname+'/public/img/uploads/',limits:{fileSize:10*1048576}}).array('profileImage'));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Use flash messages
app.use(flash());

app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req,res);
  res.locals.moment = require('moment');
  res.locals.title = false;
  res.locals.user = req.user || false;
  res.locals.courses = false;
  res.locals.instructorEdit = false;
  res.locals.studentWatch = false;
  res.locals.url = req.url || false;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/courses', courses);
app.use('/about', about);






app.listen('3000','localhost', function(){
  console.log('listening on port 3000');
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
