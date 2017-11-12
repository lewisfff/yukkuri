
const GameTokenLength = 7;

class GameClient {

  constructor() {
    this._onGetTokenCallback = () => {};
    this._onClientDisconnectCallback = () => {};
    this._onStartGame = () => {};
    this._onGetOpponent = () => {};

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
    }.bind(this))
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
