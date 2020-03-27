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

//  after entering a room name
function playFriend(roomname) {
    console.log(`i want to play in room ${roomname}`)
    socket.emit('request_friend_game', roomname);
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
        playFriend($('#name-input').value);
    },
    decline: () => {
        roomInput.deleteContent();
    }
}

const roomInput = {
    checkContent: () => {
        if ($('#name-input').value === '') {
            bar.hide();
        } else {
            // sanitize input
            $('#name-input').value = $('#name-input').value.replace(/[^a-zA-Z0-9]/g, '_');
            if ($('#name-input').value.length > 16) {
                $('#name-input').value = $('#name-input').value.slice(0, 16);
            }
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
            roomInput.focus();
        } else {
            roomInput.hide();
            roomInput.deleteContent();
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
}

$('#name-input').addEventListener('input', roomInput.checkContent);
$('#name-input').addEventListener('click', roomInput.click);
$('#accept').addEventListener('click', bar.accept);
$('#decline').addEventListener('click', bar.decline);

// add event listener
$('#play-random').addEventListener('click', playRandom);
$('#play-friend').addEventListener('click', roomInput.toggle);

localStorage.debug = 'socket.io-client:socket';

onPageLoad();