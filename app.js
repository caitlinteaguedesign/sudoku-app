// setup
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const app = express();

// constants
const MONGODB_URI = "mongodb+srv://admin:"+process.env.MONGO_ATLAS_PW+"@sudokucluster.ztnsx.mongodb.net/SudokuApp?retryWrites=true&w=majority";

// routes
const usersRoute = require('./api/routes/users');
const puzzlesRoute = require('./api/routes/puzzles');

// Connecting
mongoose.connect(MONGODB_URI, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useFindAndModify: false,
   useCreateIndex: true
})
.catch(err => {
   console.log(err);
})

mongoose.connection.on('connected', () => {
   console.log('Database Connected');
});

mongoose.connection.on('disconnected', err => {
   console.log('Database Disconnected');
})

// PASSPORT
app.use(passport.initialize());
require('./config/passport')(passport);

// HTTP request logger
app.use(morgan('dev'));

// Body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routing
app.use('/users', usersRoute);
app.use('/puzzles', puzzlesRoute);

// Errors
app.use((req, res, next) => {
   const error = new Error('Not found');
   error.status = 404;
   next(error);
})
app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message
      }
   })
})

// end
module.exports = app;