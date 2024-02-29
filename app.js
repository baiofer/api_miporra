var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ClubController = require('./apiControllers/ClubController');
const LotteryController = require('./apiControllers/LotteryController');
const ClientController = require('./apiControllers/ClientController');
const ClubBetController = require('./apiControllers/ClubBetController');
const LotteryBetController = require('./apiControllers/LotteryBetController');
const LoginController = require('./apiControllers/LoginController');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
const clubController = new ClubController
const lotteryController = new LotteryController
const clientController = new ClientController
const clubBetController = new ClubBetController
const lotteryBetController = new LotteryBetController
const loginController = new LoginController

// Clients
app.get('/v1.0/clients', clientController.getClients());
app.post('/v1.0/newClient', clientController.createClient());
app.delete('/v1.0/deleteClient', clientController.deleteClient());
app.update('/v1.0/updateClient', clientController.updateClient());

// Clubs
app.get('/v1.0/clubs', clubController.getClubs());
app.post('/v1.0/newClub', clubController.createClub());
app.delete('/v1.0/deleteClun', clubController.deleteClub());
app.update('/v1.0/updateClub', clubController.updateClub());

// Lotteries
app.get('/v1.0/lotteries', lotteryController.getLotteries());
app.post('/v1.0/createLottery', lotteryController.createLottery());
app.delete('/v1.0/deleteLottery', lotteryController.deleteLottery());
app.update('/v1.0/updateLottery', lotteryController.updateLottery());

// Club bets
app.get('/v1.0/clubBets', clubBetController.getClubBets());
app.post('/v1.0/createClubBet', clubBetController.createClubBet());
app.delete('/v1.0/deleteClubBet', clubBetController.deleteClubBet());
app.update('/v1.0/updateClubBet', clubBetController.updateClubBet());

// Lottery bets
app.get('/v1.0/lotteryBets', lotteryBetController.getLotteryBets());
app.post('/v1.0/createLotteryBet', lotteryBetController.createLotteryBet());
app.delete('/v1.0/deleteLotteryBet', lotteryBetController.deleteLotteryBet());
app.update('/v1.0/updateLotteryBet', lotteryBetController.updateLotteryBet());

// Login
app.post('/v1.0', loginController.login())

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
