
const multiplayer = require('./multiplayer.js');
const client = new multiplayer.GameClient();

window._2Type = {
    init: function() {
        console.log('init');
    },

    getCurrentStep: function() {
        return document.querySelector('#stage span:last-of-type');
    },

    keyCharPress: function(char) {
        if (_2Type.getCurrentStep().innerText == char) {
            _2Type.getCurrentStep().remove();
        }
    }
}

window.addEventListener('keypress', e => _2Type.keyCharPress(e.key));

_2Type.init();
