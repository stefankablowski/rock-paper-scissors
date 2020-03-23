// attach socket.io to existing express server

const httpServer = require('./server.js');
module.exports = require('socket.io')(httpServer);