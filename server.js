// setup
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:gPDecnvGyOiIIiWC@sudokucluster.ztnsx.mongodb.net/sudokuapp?retryWrites=true&w=majority";

const path = require('path');
const usersRoute = require('./api/routes/users');

// connect
mongoose.connect(MONGODB_URI, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useFindAndModify: false
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

// HTTP request logger
app.use(morgan('tiny'));

// Body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routing
app.use('/users', usersRoute);

// Listen for connections, changes
app.listen(PORT, console.log(`Server is starting at ${PORT}`));