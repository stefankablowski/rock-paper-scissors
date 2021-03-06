const IMAGE_PATH = './public/img/'
var socket;

// jQuery fake
var $ = (element) => document.querySelector(element);

function createConnection() {
    if (socket) {
        socket.disconnect();
    }
    socket = io('/gameNSP');
}

function animateHandsUp() {
    let hands = document.querySelectorAll('.animated-frame');
    for (hand of hands) {
        hand.classList.add('up');
        hand.classList.remove('down');
    }
    console.log('hands up');
}

function animateHandsDown() {
    let hands = document.querySelectorAll('.animated-frame');
    for (hand of hands) {
        hand.classList.remove('up');
        hand.classList.add('down');
    }
    console.log('hands down');

}

function animateHandsNeutral() {
    let hands = document.querySelectorAll('.animated-frame');
    for (hand of hands) {
        hand.classList.remove('up');
        hand.classList.remove('down');
    }
    console.log('hands neutral');

}

function animateHandsFull() {
    setTimeout(animateHandsDown, 500);
    setTimeout(animateHandsUp, 1000);
    setTimeout(animateHandsDown, 1400);
    setTimeout(animateHandsUp, 1800);
    setTimeout(animateHandsNeutral, 2200);
}

function startGame(data) {
    display.show('ingame');
    ingame.setupPlayerList(data);
}

function startLobby(data) {
    lobby.setupPlayerColumn(data);
}

createConnection();

socket.on('inform', (message) => {
    console.log(message);
});

socket.on('start_game', (data) => {
    console.log('the game can start');
    startGame(data);
});

socket.on('lobby_update', (data) => {
    lobby.setupPlayerColumn(data);
})

function playRandom() {
    console.log('wanna play random')
    socket.emit('request_random_game');
}

function sendReady(bool) {
    if (bool) {
        socket.emit('ready');
    } else {
        socket.emit('unready');
    }
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
        display.show('lobby');
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



const display = {
    show: function(area) {
        // hide everything
        $('#main-menu').classList.add('hide');
        $('#ingame').classList.add('hide');
        $('#lobby').classList.add('hide');
        $(`#${area}`).classList.remove('hide');


    },
}

const ingame = {
    setupPlayerList: function(data) {
        let playerString = '';
        for (const [player, choice] of Object.entries(data)) {
            playerString = playerString + `
            <div class="player-box">
            <div class="img-wrapper"><div class="animated-frame"><img src=${IMAGE_PATH}${choice}.png></div></div>
            <div class="player-label">${player}</div>
            </div>`
        }
        $('#player-list').innerHTML = playerString;
    },
    startTurn: function(data) {
        // give object with {player:choice}
        animateHandsFull();
    }

}

const lobby = {
    setupPlayerColumn: function(data) {
        let playerString = '';
        for (const [player, statuscode] of Object.entries(data)) {
            if (statuscode) {
                playerString = playerString + `
                <div class="lobby-label ready">${player}</div>`
            } else {
                playerString = playerString + `
                <div class="lobby-label">${player}</div>`
            }
        }
        $('#player-column').innerHTML = playerString;
    },
    toggleReady: function() {
        console.log('toggling');
        lobby.setReady($('.get-ready').classList.contains('ready'));
    },
    setReady: function(bool) {
        if (bool) {
            $('.get-ready').classList.remove('ready');
            sendReady(true);
        } else {
            $('.get-ready').classList.add('ready');
            sendReady(false);
        }
    }
}

function onPageLoad() {
    display.show('main-menu');
    roomInput.deleteContent();
    playerInput.deleteContent();
    // data
    let playerData = {
            john: true,
            stefan: false,
            marko: true,
        }
        //startGame(playerData);

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

// lobby ready toggle button
$('.get-ready').addEventListener('click', lobby.toggleReady);

localStorage.debug = 'socket.io-client:socket';

onPageLoad();