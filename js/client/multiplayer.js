
const GameTokenLength = 7;

class GameClient {

  constructor() {
    this._onGetTokenCallback = () => {};
    this._onClientDisconnectCallback = () => {};
    this._onStartGame = () => {};

    this.token = null;
    this.name = 'anonymous'; 
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
  }

  onStartGame(callback) {
    if (typeof callback === 'function')
      this._onStartGame = callback;
  }

  onGetToken(callback) {
    if (typeof callback === 'function')
      this._onGetTokenCallback = callback;
  }

  onClientDisconnect(callback) {
    if (typeof callback === 'function')
      this._onClientDisconnectCallback = callback;
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
    return token;
  return null;
};

exports.GameClient = GameClient;
exports.isUserNameValid = isUserNameValid;
exports.FindGameToken = FindGameToken;
