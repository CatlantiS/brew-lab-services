var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var colors = require('colors');
var session = require('express-session');

var app = express();

var oauth2 = require('./oauth/config.js')();
var api = require('./routes/api')(oauth2);
var auth = require('./routes/auth')(oauth2);
var logging = require('./routes/logging')(oauth2);
app.set('oauth2', oauth2);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// oauth20 use statements
app.use(session({ secret: 'oauth20-provider-test-server', resave: false, saveUninitialized: false }));
app.use(oauth2.inject());

//Todo: configure this to limit origins.
//Enable CORS
app.use(function(req, res, next) {
  console.log('injecting headers');
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method.toLowerCase() === "options") {
    res.status(200);
    res.end();
  }
  else
  {
    next();
  }

});

app.use('/auth', auth);
app.use('/api', api);
app.use('/logging', logging);

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
