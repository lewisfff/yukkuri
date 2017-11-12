
const GameTokenLength = 7;

class GameClient {

  constructor() {
    this._onGetTokenCallback = () => {};
    this._onClientDisconnectCallback = () => {};

    this.token = null;
    this.name = 'anonymous'; 
    this.socket = io();

    this.socket.on('token', function(token) {
      this._onGetTokenCallback.call(null, token);
    }.bind(this));

    this.socket.on('disconnected', function(args) {
      this._onClientDisconnectCallback.call(null, args);
    }.bind(this));
  }

  onGetToken(callback) {
    if (typeof callback === 'function')
      this._onGetTokenCallback = callback;
  }

  onClientDisconnect(callback) {
    if (typeof callback === 'function')
      this._onClientDisconnectCallback = callback;
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
