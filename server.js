const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Listen for connections, changes
server.listen(PORT, console.log(`Server is starting at ${PORT}`));