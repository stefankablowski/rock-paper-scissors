var socket;

function createConnection() {
    if (socket) {
        socket.disconnect();
    }
    socket = io('/gameNSP');
}

createConnection();

socket.on('invitation-sent', function(userName, userId) {
    console.log(`${userName} wants to play with you! (userid:${userId})`);
});

localStorage.debug = 'socket.io-client:socket';