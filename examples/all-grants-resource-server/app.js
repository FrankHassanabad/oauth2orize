/**
 * Module dependencies.
 */
var express = require('express')
  , site = require('./site')
  , passport = require('passport')

// Express configuration
var app = express.createServer();
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'client keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration
require('./auth');


app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/info', site.info);
app.get('/api/protectedEndPoint', site.protectedEndPoint);
app.listen(4000);
