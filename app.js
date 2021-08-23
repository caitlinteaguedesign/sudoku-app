// setup
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const app = express();

// constants
const MONGODB_URI = "mongodb+srv://admin:"+process.env.MONGO_ATLAS_PW+"@"+process.env.DATABASE_URL+"?retryWrites=true&w=majority";

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
app.use(morgan('tiny'));

// Body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers', 
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);

	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

// Routing
app.use('/users', usersRoute);
app.use('/puzzles', puzzlesRoute);

// Client
if(process.env.NODE_ENV !== "development") {
   app.use(express.static('client/build'));

   const path = require('path');
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   });
}

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