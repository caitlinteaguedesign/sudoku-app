// setup
const app = require('./app');

// constants
const PORT = process.env.PORT || 4000;

// declare protocol - might use https when on digital ocean
let protocol;

if(process.env.NODE_ENV !== "development") {
   protocol = require('https');
}
else {
   protocol = require('http');
}

// setup server
server = protocol.createServer(app);

// Listen for connections, changes
server.listen(PORT, console.log(`Server is starting at ${PORT}`));