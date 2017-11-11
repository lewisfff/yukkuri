
const multiplayer = require('./multiplayer.js');
const client = new multiplayer.GameClient();

window._2Type = {
    init: function() {
        console.log('init');
        _2Type.nextButton = document.querySelector('#next-button');
        _2Type.startButton = document.querySelector('#start');
        _2Type.nameInput = document.querySelector('[name=player_name]');
        _2Type.menuOverlay = document.querySelector('#main-menu');
        _2Type.nameEntry();
        _2Type.nextButton.addEventListener('click', e => _2Type.mainMenu());
        _2Type.startButton.addEventListener('click', e => _2Type.startGame());
        console.log(_2Type.nextButton);
    },

    getCurrentStep: function() {
        return document.querySelector('#stage span:last-of-type');
    },

    keyCharPress: function(char) {
        if (_2Type.getCurrentStep().innerText == char) {
            _2Type.getCurrentStep().remove();
        }
    },

    nameEntry: function() {
        _2Type.playerName = _2Type.nameInput.value;
    },

    mainMenu: function() {
        _2Type.nameEntry();
        alert('main menu, player '+_2Type.playerName);
        document.querySelector('#menu1').classList.add('hidden');
        document.querySelector('#menu2').classList.remove('hidden');
    },

    startGame: function() {
        alert('game starting, player '+_2Type.playerName);
        document.querySelector('#main-menu').classList.add('hidden');
    }

}

window.addEventListener('keypress', e => _2Type.keyCharPress(e.key));

_2Type.init();
