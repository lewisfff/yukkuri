
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
