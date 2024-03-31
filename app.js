import createError from "http-errors"
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import logger from "morgan"
import router from "./routes/index.js"
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
import { upload } from './lib/uploadConfig.js'
import { jwtAuthMiddleware } from "./lib/jwtAuthMiddleware.js";


export var app = express();

// Init firebase
export const appFirebase = initializeApp(firebaseConfig)

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
swaggerMiddleware(app)
//app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', '*');
//  next();
//});
app.use(cors({
  origin: '*', // allows any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API routes
const clubController = new ClubController
const lotteryController = new LotteryController
const clientController = new ClientController
const clubBetController = new ClubBetController
const lotteryBetController = new LotteryBetController
const loginController = new LoginController

// Clients
app.use('/v1.0/clients', clientController.getClients);
app.use('/v1.0/clientsJwt', jwtAuthMiddleware, clientController.getClientsJwt);
app.use('/v1.0/newClient', upload.single('logo'), clientController.createClient);
app.use('/v1.0/deleteClient', jwtAuthMiddleware, clientController.deleteClient);
app.use('/v1.0/updateClient', jwtAuthMiddleware, upload.single('logo'), clientController.updateClient);

// Clubs
app.use('/v1.0/clubs', clubController.getClubs);
app.use('/v1.0/clubsJwt', jwtAuthMiddleware, clubController.getClubsJWT);
app.use('/v1.0/newClub', jwtAuthMiddleware, clubController.createClub);
app.use('/v1.0/updateClub/:id', jwtAuthMiddleware, clubController.updateClub);
app.use('/v1.0/deleteClub/:id', jwtAuthMiddleware, clubController.deleteClub);


// Lotteries
app.use('/v1.0/lotteries', lotteryController.getLotteries);
app.use('/v1.0/lotteriesJwt', jwtAuthMiddleware, lotteryController.getLotteriesJwt);
app.use('/v1.0/newLottery', jwtAuthMiddleware, lotteryController.createLottery);
app.use('/v1.0/deleteLottery/:id', jwtAuthMiddleware, lotteryController.deleteLottery);
app.use('/v1.0/updateLottery/:id', jwtAuthMiddleware, lotteryController.updateLottery);

// Club bets
app.use('/v1.0/clubBets', clubBetController.getClubBets);
app.use('/v1.0/clubBetsJwt', jwtAuthMiddleware, clubBetController.getClubBetsJwt);
app.use('/v1.0/newClubBet', jwtAuthMiddleware, clubBetController.createClubBet);
app.use('/v1.0/deleteClubBet/:id', jwtAuthMiddleware, clubBetController.deleteClubBet);
app.use('/v1.0/updateClubBet/:id', jwtAuthMiddleware, clubBetController.updateClubBet);

// Lottery bets
app.use('/v1.0/lotteryBets', lotteryBetController.getLotteryBets);
app.use('/v1.0/lotteryBetsJwt', jwtAuthMiddleware, lotteryBetController.getLotteryBetsJwt);
app.use('/v1.0/newLotteryBet', jwtAuthMiddleware, lotteryBetController.createLotteryBet);
app.use('/v1.0/deleteLotteryBet/:id', jwtAuthMiddleware, lotteryBetController.deleteLotteryBet);
app.use('/v1.0/updateLotteryBet/:id', jwtAuthMiddleware, lotteryBetController.updateLotteryBet);

// Login
app.use('/v1.0/login', loginController.login)

// WEB routes

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // If error in API request
  // response of error in json format
  if (req.originalUrl.startsWith('/v1.0/')) {
    res.json({ error: err.message || "Not found"})
    return
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
