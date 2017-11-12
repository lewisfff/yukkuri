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

        // store default vars
        _2Type.playerName = "Player";
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
                    alert('You beat the game?');
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
        document.querySelector('#main-menu').classList.add('hidden');
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

        _2Type.playerCurrentStepChar = _2Type.gameStringsArray[0].charAt(0);
        _2Type.playerNameElem.innerHTML = _2Type.playerName;
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
    this.socket = io();
  }

}

const isUserNameValid = (name) => !(/[^a-zA-Z0-9]/.test(name));

const FindGameToken = () => {
  let token = location.hash;
  if (token.length == GameTokenLength)
    return token;
  return null;
};

exports.GameClient = GameClient;
exports.isUserNameValid = isUserNameValid;
exports.FindGameToken = FindGameToken;


/***/ })
/******/ ]);