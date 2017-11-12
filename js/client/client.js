
const multiplayer = require('./multiplayer.js');
const client = new multiplayer.GameClient();

client.onGetToken(function(token) {
    console.log(`received token ${token}`);
});

client.onClientDisconnect(function(args) {
    console.log(`disconnect event: ${args}`);
});

client.onStartGame(function(words) {
    console.log('words:', words);
});

window.joinGame = function(token) {
    client.joinGame(token);
}

window.startGame = function(wordCount) {
    client.startGame();
}

// multiplayer.isUserNameValid('cat') => true
// let token = multiplayer.FindToken(); if (token !== null) ...

window._2Type = {
    init: function() {
        // define html elements
        _2Type.nextButton = document.querySelector('#next-button');
        _2Type.startButton = document.querySelector('#start');
        _2Type.activeZone = document.querySelector('#active-zone');
        _2Type.stack = document.querySelector('#stack');
        _2Type.nameInput = document.querySelector('[name=player_name]');
        _2Type.menuOverlay = document.querySelector('#main-menu');
        _2Type.playerNameElem = document.querySelector('#player-name');
        _2Type.playerAccElem = document.querySelector('#player-acc');
        _2Type.playerCompleteElem = document.querySelector('#player-complete');
        _2Type.endScreenElem = document.querySelector('#complete-modal');
        _2Type.playerNameElems = document.querySelectorAll('.player_name');
        _2Type.enemyNameElems = document.querySelectorAll('.enemy_name');
        _2Type.winnerNameElem = document.querySelector('.winner_name');

        // store default vars
        _2Type.playerName = "Player";
        _2Type.enemyName = "Enemy";
        // number of note steps achieved
        _2Type.playerAccumulativeStep = null;
        // current desired character for current step
        _2Type.playerCurrentStepChar = null;
        // charAt for the current desired step char
        _2Type.playerCurrentStepCharIteration = null;
        // number of keys pressed total
        _2Type.playerTotalStep = null;
        // timestamp for when game timer started
        _2Type.playerStartTime = null;
        // array of strings used as the game level
        _2Type.gameStringsArray = [
            'This','is','the','default','game','string','for','2-type.',
            'Copy','the','link','to','a','friend','and','the','real',
            'game','will','start!'
        ];

        new Clipboard('#copy-invite-link');

        // run startup functions
        _2Type.nameEntry();
        _2Type.nextButton.addEventListener('click', e => _2Type.mainMenu());
        _2Type.startButton.addEventListener('click', e => _2Type.initGame());
    },

    getCurrentStep: function() {
        return document.querySelector('#stage span:last-of-type');
    },

    keyCharPress: function(char) {
        // todo: clean up this function does way too much
        if (_2Type.playerCurrentStepChar == char) {
            _2Type.playerCurrentStepCharIteration++;
            let nextChar = _2Type.gameStringsArray[0]
                                .charAt(_2Type.playerCurrentStepCharIteration);
            if (nextChar !== "") {
                // iterate to next character
                _2Type.playerCurrentStepChar = nextChar;

                _2Type.activeZone.classList.add('pgood');
                setTimeout(function(){
                    _2Type.activeZone.classList.remove('pgood');
                }, 20);
            } else {
                // if there is no next character, iterate to next word
                _2Type.getCurrentStep().remove();
                _2Type.playerCurrentStepCharIteration = 0;
                _2Type.gameStringsArray.shift();

                _2Type.activeZone.classList.add('good');
                setTimeout(function(){
                    _2Type.activeZone.classList.remove('good');
                }, 60);

                if (_2Type.gameStringsArray.length) {
                    _2Type.playerCurrentStepChar = _2Type.gameStringsArray[0].charAt(0);
                } else {
                    // game has most likely finished
                    _2Type.endGame();
                }
            }
        } else {
            _2Type.activeZone.classList.add('bad');
            setTimeout(function(){
                _2Type.activeZone.classList.remove('bad');
            }, 60);
        }
    },

    nameEntry: function() {
        _2Type.playerName = _2Type.nameInput.value;
    },

    mainMenu: function() {
        _2Type.nameEntry();
        document.querySelector('#menu1').classList.add('hidden');
        document.querySelector('#menu2').classList.remove('hidden');
    },

    // show game window
    initGame: function() {
        _2Type.menuOverlay.classList.add('hidden');
        _2Type.endScreenElem.classList.add('hidden');
        _2Type.startGame();
    },

    startGame: function() {
        _2Type.stack.innerHTML = '';
        // TODO LILAH: pass networked string in when starting 2P mode
        // getNetworkedString();

        // else
        // pass the gamestringarray in, reverse it, put it onto the stage
        for (var i = _2Type.gameStringsArray.length - 1; i >= 0; i--) {
            let span = document.createElement('span');
            let text = document.createTextNode(_2Type.gameStringsArray[i]);
            span.appendChild(text);
            _2Type.stack.appendChild(span);
        }

        for (var i = 0; i < _2Type.playerNameElems.length; i++) {
            _2Type.playerNameElems[i].innerHTML = _2Type.playerName;
        }

        for (var i = 0; i < _2Type.enemyNameElems.length; i++) {
            _2Type.enemyNameElems[i].innerHTML = _2Type.enemyName;
        }

        _2Type.playerCurrentStepChar = _2Type.gameStringsArray[0].charAt(0);
        _2Type.playerNameElem.innerHTML = _2Type.playerName;
    },

    endGame: function() {
        _2Type.endScreenElem.classList.remove('hidden');
    }
}

window.addEventListener('keypress', e => _2Type.keyCharPress(e.key));

_2Type.init();
