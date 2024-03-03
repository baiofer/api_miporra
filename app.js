import createError from "http-errors"
import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import logger from "morgan"
import ClubController from "./apiControllers/ClubController.js";
import LotteryController from './apiControllers/LotteryController.js';
import ClientController from './apiControllers/ClientController.js';
import ClubBetController from './apiControllers/ClubBetController.js';
import LotteryBetController from './apiControllers/LotteryBetController.js';
import LoginController from './apiControllers/LoginController.js';
import { initializeApp } from 'firebase/app'
import firebaseConfig from "./lib/firebaseConfig.js"
import swaggerMiddleware from "./lib/swaggerMiddleware.js";
import multer from 'multer'


export var app = express();

// Init firebase
export const appFirebase = initializeApp(firebaseConfig)

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setup multer for real files (client logos)
const upload = multer({ dest: 'uploads/' })

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
swaggerMiddleware(app)

// API routes
const clubController = new ClubController
const lotteryController = new LotteryController
const clientController = new ClientController
const clubBetController = new ClubBetController
const lotteryBetController = new LotteryBetController
const loginController = new LoginController

// Clients
app.use('/v1.0/clients', clientController.getClients);
app.use('/v1.0/newClient', upload.single('logo'), clientController.createClient);
//app.use('/v1.0/newClient', clientController.createClient);
app.use('/v1.0/deleteClient', clientController.deleteClient);
app.use('/v1.0/updateClient', clientController.updateClient);

// Clubs
app.use('/v1.0/clubs', clubController.getClubs);
app.use('/v1.0/newClub', clubController.createClub);
app.use('/v1.0/deleteClun', clubController.deleteClub);
app.use('/v1.0/updateClub', clubController.updateClub);

// Lotteries
app.use('/v1.0/lotteries', lotteryController.getLotteries);
app.use('/v1.0/createLottery', lotteryController.createLottery);
app.use('/v1.0/deleteLottery', lotteryController.deleteLottery);
app.use('/v1.0/updateLottery', lotteryController.updateLottery);

// Club bets
app.use('/v1.0/clubBets', clubBetController.getClubBets);
app.use('/v1.0/createClubBet', clubBetController.createClubBet);
app.use('/v1.0/deleteClubBet', clubBetController.deleteClubBet);
app.use('/v1.0/updateClubBet', clubBetController.updateClubBet);

// Lottery bets
app.use('/v1.0/lotteryBets', lotteryBetController.getLotteryBets);
app.use('/v1.0/createLotteryBet', lotteryBetController.createLotteryBet);
app.use('/v1.0/deleteLotteryBet', lotteryBetController.deleteLotteryBet);
app.use('/v1.0/updateLotteryBet', lotteryBetController.updateLotteryBet);

// Login
app.use('/v1.0', loginController.login)

// WEB routes
import router from "./routes/index.js"
app.use('/', router);

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

export default app;
