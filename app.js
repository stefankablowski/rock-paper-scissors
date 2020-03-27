const express = require('express');
const Room = require('./model/room');
const Player = require('./model/player');

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
gameNSP.on('connection', (socket) => {
    console.log(`socket with id ${socket.id} joined the server`);

    socket.on('request_friend_game', (playername, roomname) => {
        console.log(`socket with id ${socket.id} (${playername}) wants to play vs a friend in room ${roomname}`);

        // sanitize user input here

        let currentPlayer = new Player(playername, socket.id);
        // if room exists: join the room
        for (r of rooms) {
            if (r.name === roomname) {
                // player already in room?
                console.log(`${roomname} already exists`)
                if (!(r.players.find(pl => pl.name === currentPlayer.name))) {
                    console.log(`player ${playername} joined room ${roomname}`);
                    r.players.push(currentPlayer);

                    // start the game
                    if (r.players.length > 1) {
                        console.log('starting the game');
                        r.players.forEach(p => {
                            if (gameNSP.connected[p.socketId]) {
                                gameNSP.connected[p.socketId].join(`/${roomname}`);
                                gameNSP.in(`/${roomname}`).emit('inform', 'you are now playing');
                            }

                        });
                    }
                }
                return;
            }
        }

        // else: create new room
        console.log('creating new room');
        let newRoom = new Room();
        newRoom.name = roomname;
        rooms.push(newRoom);
        newRoom.push(currentPlayer);
    });


    socket.on('request_random_game', function() {
        console.log(`socket with id ${socket.id} wants to play random`);
        // if someone in queue: take first out of queue
        //  create game with me and him

        // if queue empty: go to queue
    });

    //disconnect
    socket.on('disconnect', function() {
        console.log(`Socket with id ${socket.id} left the server.`);
    });
});