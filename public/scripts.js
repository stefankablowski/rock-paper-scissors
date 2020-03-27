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

socket.on('inform', (message) => {
    console.log(message);
});

function playRandom() {
    console.log('wanna play random')
    socket.emit('request_random_game');
}

//  after entering a room name
function playFriend(playername, roomname) {
    console.log(`${playername} wants to play in room ${roomname}`)
    socket.emit('request_friend_game', playername, roomname);
}

/* Accept decline bar */
const bar = {
    show: () => {
        $('#accept-decline-bar').classList.remove('hide');
    },
    hide: () => {
        $('#accept-decline-bar').classList.add('hide');
    },
    accept: () => {
        playFriend($('#player-input').value, $('#name-input').value);
    },
    decline: () => {
        roomInput.deleteContent();
    }
}

const roomInput = {
    checkContent: () => {
        roomInput.sanitize();
        playerInput.sanitize();
        if ($('#name-input').value === '' || $('#player-input').value === '') {
            bar.hide();
        } else {
            bar.show();
        }
    },
    show: () => {
        $('#enter-name-frame').classList.remove('hide');
    },
    hide: () => {
        $('#enter-name-frame').classList.add('hide');
        $('#accept-decline-bar').classList.add('hide');
    },
    toggle: () => {
        if ($('#enter-name-frame').classList.contains('hide')) {
            roomInput.show();
            playerInput.focus();
        } else {
            roomInput.hide();
            roomInput.deleteContent();
            playerInput.deleteContent();
        }
    },
    click: (event) => {
        event.stopPropagation();
    },
    focus: () => {
        $('#name-input').focus();
    },
    deleteContent: () => {
        $('#name-input').value = '';
    },
    sanitize: (spoiledString) => {
        $('#name-input').value = $('#name-input').value.replace(/[^a-zA-Z0-9]/g, '_');
        if ($('#name-input').value.length > 16) {
            $('#name-input').value = $('#name-input').value.slice(0, 16);
        }
    },
    onEnter: (event) => {
        if (event.keyCode === 13) { //On Enter pressed
            bar.accept();
        }

    }
}

const playerInput = {
    focus: () => {
        $('#player-input').focus();
    },
    click: (event) => {
        event.stopPropagation();
    },
    sanitize: (spoiledString) => {
        $('#player-input').value = $('#player-input').value.replace(/[^a-zA-Z0-9]/g, '_');
        if ($('#player-input').value.length > 16) {
            $('#player-input').value = $('#player-input').value.slice(0, 16);
        }
    },
    deleteContent: () => {
        $('#player-input').value = '';
    },
    onEnter: (event) => {
        if (event.keyCode === 13) { //On Enter pressed
            roomInput.focus();
        }

    }
}



function accept() {
    console.log('accept');
}

function decline() {
    console.log('decline');
}


function onPageLoad() {
    roomInput.deleteContent();
    playerInput.deleteContent();
}

// keep text input sanitized and accept-bar up to date
$('#name-input').addEventListener('input', roomInput.checkContent);
$('#player-input').addEventListener('input', roomInput.checkContent);

// prevent box from collapsing when clicking on input field
$('#name-input').addEventListener('click', roomInput.click);
$('#player-input').addEventListener('click', playerInput.click);

// jump to next textinput
$('#player-input').addEventListener('keydown', playerInput.onEnter);
$('#name-input').addEventListener('keydown', roomInput.onEnter);

// accept and decline button functionality
$('#accept').addEventListener('click', bar.accept);
$('#decline').addEventListener('click', bar.decline);

// main menu button functionality
$('#play-random').addEventListener('click', playRandom);
$('#play-friend').addEventListener('click', roomInput.toggle);

localStorage.debug = 'socket.io-client:socket';

onPageLoad();