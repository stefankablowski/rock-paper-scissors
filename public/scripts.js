var socket;

function setup() {
    socket = io();
}

setup();

socket.on('invitation-sent', function(userName, userId) {
    console.log(`${userName} wants to play with you! (userid:${userId})`);
});