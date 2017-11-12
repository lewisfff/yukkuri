
const _generate = () => {
	var c = "A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0VWXYZ";
	var result = '';
	for (var i = 0; i < 6; i++) {
		result += c.charAt(Math.floor(Math.random() * c.length));
	}
	return result;
};

const generateUnique = (io) => {
  let token = null;
  do {
    token = _generate();
  } while(token in io.sockets.adapter.rooms);
  return token;
}

exports.generateUnique = generateUnique;
