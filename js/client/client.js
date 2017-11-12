
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

client.onGetOpponent(function(name) {
    console.log('opponent:', name);
});

window.setName = function(name) {
    client.setUserName(name);
}

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
        _2Type.endScreenElem = document.querySelector('#complete-modal');
        _2Type.playerNameElems = document.querySelectorAll('.player_name');
        _2Type.playerAccElems = document.querySelectorAll('.player_acc');
        _2Type.playerMistakeElems = document.querySelectorAll('.player_mistakes');
        _2Type.playerCompleteElems = document.querySelectorAll('.player_complete');
        _2Type.playerTimeElem = document.querySelector('#player_time');
        _2Type.enemyNameElems = document.querySelectorAll('.enemy_name');
        _2Type.enemyCompleteElems = document.querySelectorAll('.enemy_complete');
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
        // timestamp for when game timer finished
        _2Type.playerEndTime = null;
        // array of strings used as the game level
        _2Type.gameStringsArray = [
            'This','is','the','default','game','string','for','2-type.',
            'Copy','the','link','to','a','friend','and','the','real',
            'game','will','start!'
        ];
        _2Type.gameStringsLength = null;

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
            _2Type.playerAccumulativeStep++;
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
        _2Type.updatePlayerStats();
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
        _2Type.gameStringsLength = _2Type.gameStringsArray.reduce((total,element) => total + element.length, 0);
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
    },

    endGame: function() {
        _2Type.playerEndTime = Date.now();
        let finalTime = (_2Type.playerEndTime - _2Type.playerStartTime) / 1000;
        _2Type.playerTimeElem.innerHTML = finalTime+'s';
        _2Type.endScreenElem.classList.remove('hidden');
    },

    updatePlayerStats: function() {
        _2Type.playerTotalStep++;
        let mistakes = _2Type.playerTotalStep -_2Type.playerAccumulativeStep;
        let acc = _2Type.playerAccumulativeStep / _2Type.playerTotalStep;
        for (var i = 0; i < _2Type.playerAccElems.length; i++) {
            _2Type.playerAccElems[i].innerHTML = acc.toFixed(2);
        }
        for (var i = 0; i < _2Type.playerCompleteElems.length; i++) {
            _2Type.playerCompleteElems[i].innerHTML =
                _2Type.playerAccumulativeStep+'/'+_2Type.gameStringsLength;
        }
        for (var i = 0; i < _2Type.playerMistakeElems.length; i++) {
            _2Type.playerMistakeElems[i].innerHTML = mistakes;
        }
        if (_2Type.playerStartTime === null) {
            _2Type.playerStartTime = Date.now();
        }
    }
}

window.addEventListener('keypress', e => _2Type.keyCharPress(e.key));

_2Type.init();
