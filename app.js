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

        // TODO: sanitize user input here

        // create new player
        let currentPlayer = new Player(playername, socket.id);

        // if room exists: join the room
        for (r of rooms) {
            if (r.name === roomname) {

                // player already in room?
                console.log(`${roomname} already exists`)
                if (!(r.players.find(pl => pl.name === currentPlayer.name))) {

                    // put player into model room
                    r.players.push(currentPlayer);
                    console.log(`player ${playername} joined room ${roomname}`);

                    // put player into socket.io room
                    if (gameNSP.connected[currentPlayer.socketId]) {
                        gameNSP.connected[currentPlayer.socketId].join(`/${roomname}`);
                    }

                    // create lobby object for client
                    let broadcastResult = {};
                    for (p of r.players) {
                        broadcastResult[p.name] = p.state;
                    }

                    gameNSP.in(`/${roomname}`).emit('lobby_update', broadcastResult);


                }
                return;
            }
        }

        // else: create new room
        console.log('creating new room');

        // create new room, set name, add to model
        let newRoom = new Room();
        newRoom.name = roomname;
        rooms.push(newRoom);

        // put player into room
        newRoom.push(currentPlayer);

        // join player to socket.io room
        if (gameNSP.connected[currentPlayer.socketId]) {
            gameNSP.connected[currentPlayer.socketId].join(`/${roomname}`);
        }
        let singleBroadcastRes = {}
        singleBroadcastRes[currentPlayer.name] = false;
        gameNSP.in(`/${roomname}`).emit('lobby_update', singleBroadcastRes);

    });

    socket.on('ready', () => {
        let roomOfPlayer = null;
        let currentPlayer
            // set player state to ready
        for (r of rooms) {
            currentPlayer = r.players.find(p => p.socketId === socket.id);
            if (currentPlayer) {
                currentPlayer.state = true;
                roomOfPlayer = r;
                break;
            }
        }
        // GUARD
        if (!currentPlayer) { return; }

        // broadcast lobby object to room
        let allPlayersReady = true;
        let broadcastResult = {};
        for (p of roomOfPlayer.players) {
            broadcastResult[p.name] = p.state;
            if (p.state === false) {
                allPlayersReady = false;
            }
        }
        gameNSP.in(`/${roomOfPlayer.name}`).emit('lobby_update', broadcastResult);
        // start game if all players are ready
        if (allPlayersReady) {
            gameNSP.in(`/${roomOfPlayer.name}`).emit('start_game', broadcastResult);
        }
    });

    socket.on('unready', () => {

        let roomOfPlayer = null;
        let currentPlayer = null;

        // find player in rooms
        for (r of rooms) {
            currentPlayer = r.players.find(p => p.socketId === socket.id);
            if (currentPlayer) {
                currentPlayer.state = true;
                roomOfPlayer = r;
                break;
            }
        }
        // GUARD, no player found
        if (!currentPlayer) { return; }

        // broadcast lobby object to room
        let broadcastResult = {};
        for (p of roomOfPlayer.players) {
            broadcastResult[p.name] = p.state;
        }
        gameNSP.in(`/${roomOfPlayer.name}`).emit('lobby_update', broadcastResult);
    })


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