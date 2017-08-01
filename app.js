var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var exphbs = require('express-handlebars');

//var pemberikerja = require('./routes/pemberikerja');

var flash =require('express-flash');
var session=require('express-session');
var mongoose=require('mongoose');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var connectflash = require('connect-flash');
var passport = require('passport');
var methodOverride = require('method-override');
var webcontenmanager = require('./routes/webcontenmanager');
var pencarikerja = require('./routes/pencarikerja');
var pemberikerja = require('./routes/pemberikerja');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.engine('handlebars', exphbs({defaultLayout:'views'}));


//app.set('view engine', 'hbs');
//app.engine('hbs', hbs({extname:'hbs' , defaultviews: 'views', viewsDir:__dirname+'./views/'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:"terserah12345" , saveUninitialized: true , resave: true}));
app.use(flash());
 // global vars
/* app.use(function (req, res, next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
 });
app.use(expressValidator({
  errorFormatter : function (param, msg , value){
    var namaspace = param.split('.')
    , root = namaspace.shift()
    ,formParam =root;

    while(namaspace.length){
      formParam += '[' +namaspace.shift()+']';
    }
    return {
      param : formParam,
      msg :msg ,
      value :value
    };
  }
}));
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(connectflash());
app.use(expressValidator())
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body == 'object' && '_method' in req.body)
    {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/pemberikerja', pemberikerja);
app.use('/webcontenmanager', webcontenmanager);
app.use('/pencarikerja', pencarikerja);


//seting dengan database //
var UserWebContentManager=require('./database/UserWebContenManager');
var userpencarikerja=require('./database/userpencarikerja');
var inputlowker=require('./database/inputlowker');
var anggota = require('./database/anggota');
var userpemberilowker =require('./database/userpemberilowker');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/skripsi');

require('./config/passportpencarikerja')(passport);
require('./config/passportuserpemberikerja')(passport);
//ahir seting database //
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
