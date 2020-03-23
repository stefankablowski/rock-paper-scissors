const express = require('express');

//Setup server
let app = require('./expr');
let httpServer = require('./server');
let io = require('./socket');

// serve html
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

io.on('connection', function(socket) {
    console.log(`socket with id ${socket.id} connected`);

    //disconnect
    socket.on('disconnect', function() {
        console.log(`Socket with id ${socket.id} disconnected.`);
    });
});