/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


const multiplayer = __webpack_require__(1);
const client = new multiplayer.GameClient();

client.onGetToken(function(token) {
    window.gameToken = token;
    console.log(`received token ${token}`);
});

client.onClientDisconnect(function(args) {
    console.log(`disconnect event: ${args}`);
});

client.onStartGame(function(words) {
    console.log('words:', words);
    _2Type.gameStringsArray = words.split(' ');
    _2Type.startGame();
});

client.onGetOpponent(function(name) {
    console.log('opponent:', name);
    _2Type.enemyName = name;
    _2Type.getOpponent();
});

client.onOpponentAnswer(function(hasMistake) {
    console.log('opponent answered: ', hasMistake);
    _2Type.showOpponentAnswer(hasMistake);
});

client.onOpponentFinish(function(stats) {
    console.log('opponent finished: ' + stats);
    _2Type.displayEnemyStats(stats);
});

window.setName = function(name) {
    client.setUserName(name);
}

window.joinGame = function(token) {
    client.joinGame(token);
}

window.startGame = function(wordCount) {
    console.log('trying to start game');
    client.startGame();
}

window.answer = function(hasMistake) {
    client.submitAnswer(hasMistake);
}

window.finish = function(stats) {
    client.submitCompletion(stats);
}

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
        _2Type.enemyAcc = document.querySelector('#enemy_acc');
        _2Type.enemyMistakes = document.querySelector('#enemy_mistakes');
        _2Type.enemyTime = document.querySelector('#enemy_time');
        _2Type.enemyStats = document.querySelector('#enemy-stats');
        _2Type.enemyStatsPending = document.querySelector('#enemy-stats-pending');
        _2Type.enemyBox = document.querySelector('#enemy-box');
        _2Type.winnerNameElem = document.querySelector('.winner_name');
        _2Type.noPlayerElem = document.querySelector('#no-player');
        _2Type.copyInviteLink = document.querySelector('#copy-invite-link');

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

        // run startup functions
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
            client.submitAnswer(true);
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
            client.submitAnswer(false);
            _2Type.activeZone.classList.add('bad');
            setTimeout(function(){
                _2Type.activeZone.classList.remove('bad');
            }, 60);
        }
        _2Type.updatePlayerStats();
    },

    nameEntry: function() {
        _2Type.playerName = _2Type.nameInput.value;
        client.setUserName(_2Type.playerName);
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

        // if (!multiplayer.isUserNameValid(_2Type.playerName))
        //     debugger;

        if (multiplayer.FindGameToken()) {
            let token = multiplayer.FindGameToken();
            window.gameToken = token;
            _2Type.noPlayerElem.classList.add('hidden');
            client.joinGame(token);
        } else {
            let token = window.gameToken;
            if (token !== null) {
                let gameURI = location.protocol + '//' + location.hostname
                    + (location.port ? ':' + location.port : '') + '/#' + token;
                _2Type.copyInviteLink.setAttribute('data-clipboard-text', gameURI);

                new Clipboard('#copy-invite-link');
            }
        }

        _2Type.startGame();
    },

    startGame: function() {
        _2Type.stack.innerHTML = '';
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

        client.submitCompletion({
            acc: _2Type.playerAccElems[0].innerHTML,
            mistakes: _2Type.playerMistakeElems[0].innerHTML,
            time: finalTime+'s'
        });
    },

    updatePlayerStats: function() {
        _2Type.playerTotalStep++;
        let mistakes = _2Type.playerTotalStep - _2Type.playerAccumulativeStep;
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
    },

    getOpponent: function() {
        _2Type.noPlayerElem.classList.add('hidden');
        for (var i = 0; i < _2Type.enemyNameElems.length; i++) {
            _2Type.enemyNameElems[i].innerHTML = _2Type.enemyName;
        }
        window.startGame(_2Type.getRandomInt(4, 10));
    },

    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    displayEnemyStats: function(stats) {
        _2Type.enemyAcc.innerHTML = stats.acc;
        _2Type.enemyMistakes.innerHTML = stats.mistakes;
        _2Type.enemyTime.innerHTML = stats.time;
        _2Type.enemyStatsPending.classList.add('hidden');
        _2Type.enemyStats.classList.remove('hidden');
    },

    showOpponentAnswer: function(status) {
        if (status) {
            _2Type.enemyBox.classList.add('pgood');
            setTimeout(function(){
                _2Type.enemyBox.classList.remove('pgood');
            }, 20);
        } else {
            _2Type.enemyBox.classList.add('bad');
            setTimeout(function(){
                _2Type.enemyBox.classList.remove('bad');
            }, 20);
        }
    }
}

window.addEventListener('keypress', e => _2Type.keyCharPress(e.key));

_2Type.init();


/***/ }),
/* 1 */
/***/ (function(module, exports) {


const GameTokenLength = 7;

class GameClient {

  constructor() {
    this._onGetTokenCallback = () => {};
    this._onClientDisconnectCallback = () => {};
    this._onStartGame = () => {};
    this._onGetOpponent = () => {};
    this._onOpponentAnswer = () => {};
    this._onOpponentFinish = () => {};

    this.token = null;
    this.name = 'anonymous';
    this.opponent = 'anonymous';
    this.socket = io();

    this.socket.on('token', function(token) {
      this._onGetTokenCallback.call(null, token);
    }.bind(this));

    this.socket.on('disconnected', function(args) {
      this._onClientDisconnectCallback.call(null, args);
    }.bind(this));

    this.socket.on('start', function(words) {
      this._onStartGame.call(null, words);
    }.bind(this));

    this.socket.on('opponentping', function(name) {
      this._onOpponentPing(name);
    }.bind(this));

    this.socket.on('opponentpong', function(name) {
      this._onOpponentPong(name);
    }.bind(this));

    this.socket.on('answer', function(hasMistake) {
      this._onOpponentAnswer.call(null, hasMistake)
    }.bind(this));

    this.socket.on('finish', function(stats) {
      this._onOpponentFinish.call(null, stats);
    }.bind(this));
  }

  _onOpponentPing(name) {
    this.opponent = name;
    this.socket.emit('opponentpong', this.name);
    this._onGetOpponent.call(null, name);
  }

  _onOpponentPong(name) {
    this.opponent = name;
    this._onGetOpponent.call(null, name);
  }

  onStartGame(callback) {
    if (typeof callback === 'function')
      this._onStartGame = callback;
  }

  onOpponentAnswer(callback) {
    if (typeof callback === 'function')
      this._onOpponentAnswer = callback;
  }

  onOpponentFinish(callback) {
    if (typeof callback === 'function')
      this._onOpponentFinish = callback;
  }

  onGetToken(callback) {
    if (typeof callback === 'function')
      this._onGetTokenCallback = callback;
  }

  onGetOpponent(callback) {
    if (typeof callback == 'function')
      this._onGetOpponent = callback;
  }

  onClientDisconnect(callback) {
    if (typeof callback === 'function')
      this._onClientDisconnectCallback = callback;
  }

  setUserName(name) {
    this.name = name;
    this.socket.emit('setname', name);
  }

  joinGame(token) {
    this.token = token;
    this.socket.emit('join', token);
  }

  startGame() {
    this.socket.emit('start');
  }

  submitAnswer(hasMistake) {
    this.socket.emit('answer', hasMistake);
  }

  submitCompletion(stats) {
    this.socket.emit('finish', stats);
  }
}

const isUserNameValid = (name) => !(/[^a-zA-Z0-9]/.test(name));

const FindGameToken = () => {
  let token = location.hash;
  if (token.length == GameTokenLength)
    return token.substring(1);
  return null;
};

exports.GameClient = GameClient;
exports.isUserNameValid = isUserNameValid;
exports.FindGameToken = FindGameToken;


/***/ })
/******/ ]);