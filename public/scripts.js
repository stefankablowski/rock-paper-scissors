var socket;
var $ = (element) => document.querySelector(element);

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

function playRandom() {
    console.log('wanna play random')
    socket.emit('request_random_game');
}

function playFriend(roomname) {
    socket.emit('request_friend_game', roomname);
}


// add event listener
$('#play-random').addEventListener('click', playRandom);
$('#play-friend').addEventListener('click', playFriend);

localStorage.debug = 'socket.io-client:socket';