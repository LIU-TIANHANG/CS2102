var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOR = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
/* --- V7: Using dotenv     --- */
require('dotenv').load();

const bodyParser = require('body-parser');

// internal file dir
const restaurant = require('./routes/Restaurant/index');
const home = require('./routes/home/index');
const reservation = require('./routes/reservation/index');
const review = require('./routes/review/index');
const graph = require('./routes/graph/index');
const town = require('./routes/town/index');
const meals = require('./routes/meals/index');
const cuisine = require('./routes/cuisines/index');
var app = express();



app.use(methodOR('_method'));
app.use(flash());
app.use(session({
  secret:'th123',
  resave:true,
  saveUninitialized:true,

}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(methodOR('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',home);
app.use('/restaurant',restaurant);
app.use('/reservation',reservation);
app.use('/review',review);
app.use('/graph',graph);
app.use('/meals',meals);
app.use('/town',town);
app.use('/cuisine',cuisine);
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
