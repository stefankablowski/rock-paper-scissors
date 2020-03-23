const app = require('./expr');

let PORT = '8080'

console.log(`server listening on port ${PORT}`);

// create server from express instance
module.exports = require('http').createServer(app).listen(PORT);