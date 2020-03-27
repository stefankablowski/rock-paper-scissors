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

/* Game variables */
const playerQueue = [];
const rooms = [];

/*Socket.io*/

const gameNSP = io.of('/gameNSP');

/* Custom namespace */
gameNSP.on('connection', function(socket) {
    console.log(`socket with id ${socket.id} joined the server`);

    socket.on('request_friend_game', function(roomname) {
        // if room exists: join the room
        // else: create new room
    });


    socket.on('request_random_game', function() {
        // if someone in queue: take first out of queue
        //  create game with me and him

        // if queue empty: go to queue
    });

    //disconnect
    socket.on('disconnect', function() {
        console.log(`Socket with id ${socket.id} left the server.`);
    });
});