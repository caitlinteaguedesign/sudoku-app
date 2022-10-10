// setup
const app = require('./app');

// constants
const PORT = process.env.PORT || 4000;

// declare protocol
let protocol = require('http');

// setup server
server = protocol.createServer(app);

// Listen for connections, changes
server.listen(PORT, console.log(`Server is starting at ${PORT}`));