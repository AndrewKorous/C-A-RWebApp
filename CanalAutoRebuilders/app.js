var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

var mongoUtil = require('./database/mongoUtil');
var app = express();

//database setup
mongoUtil.connectToServer(function(error){
  var routes = require('./routes/index');
  var services = require('./routes/services');
  var about = require('./routes/about');
  var contact = require('./routes/contact-us');
  var testimonials = require('./routes/testimonials');


  require('./database/configureDatabase');
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(lessMiddleware(path.join(__dirname, 'less'), {
    dest: path.join(__dirname, 'public'),
    options: {
      compiler: {
        compress: true
      }
    },
    preprocess: {
      path: function(pathname, req) {
        return pathname.replace('/css/', '/');
      }
    },
  }));

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);
  app.use('/services', services);
  app.use('/about', about);
  app.use('/contact-us', contact);
  app.use('/testimonials', testimonials);

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
      res.render('pages/error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.render('error', {
  //     message: err.message,
  //     error: {}
  //   });
  // });
});

module.exports = app;
