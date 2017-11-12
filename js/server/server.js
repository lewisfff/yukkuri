
const http = require('http');
const serve = require('koa-static');
const koa = require('koa');
const sockio = require('socket.io');
const request = require('request');

const token = require('./token.js');

const sentences = 'http://metaphorpsum.com/sentences/8'
const pub = '../../public';
const root = `${__dirname}/${pub}`;
const port = process.env.PORT || 3000;

const app = new koa();
app.use(serve(root));

const server = http.createServer(app.callback());

const io = sockio(server);

let initialGameText = null;

io.on('connection', function(socket) {
	let room = token.generateUnique(io);
	let name = 'anonymous';
	let completions = 0;
	socket.join(room);
	socket.emit('token', room);

	socket.on('disconnect', function() {
	});

	socket.on('join', function(token) {
		if (!io.sockets.adapter.rooms.hasOwnProperty(token))
			return;
		let targetRoom = io.sockets.adapter.rooms[token];
		if (targetRoom.length !== 1)
			return;
		socket.leave(targetRoom);
		room = token;
		socket.join(room);
		socket.emit('token', room);
		socket.broadcast.to(room).emit('opponentping', name);
	});

	socket.on('opponentpong', function(name) {
		socket.broadcast.to(room).emit('opponentpong', name);
	});

	socket.on('start', function() {
		socket.broadcast.to(room).emit('start', initialGameText);
		request(sentences, function(error, response) {
			if(!error) initialGameText = response.body;
		});
	});

	socket.on('answer', function(hasMistake) {
		hasMistake = hasMistake == true
		socket.broadcast.to(room).emit('answer', hasMistake);
	});

	socket.on('test', () => { socket.broadcast.to(room).emit('tell'); });

	socket.on('finish', function(stats) {
		let acc = mistakes = time = 'invalid'
		if ('acc' in stats)
			acc = stats['acc'];
		if ('mistakes' in stats)
			mistakes = stats['mistakes'];
		if ('time' in stats)
			time = stats['time'];
		let isStringSafe = (s) =>
			!(/[^a-zA-Z0-9\ \%\.]/.test(s))
		let castingStats = {
			'acc': isStringSafe(acc) ? acc : 'invalid',
			'mistakes': isStringSafe(mistakes) ? mistakes : 'invalid',
			'time': isStringSafe(time) ? time : 'invalid'
		};
		socket.broadcast.to(room).emit('finish', castingStats);
	});

	socket.on('setname', function(username) {
		let isUserNameValid = (name) => !(/[^a-zA-Z0-9]/.test(name));
		if (isUserNameValid(username))
			name = username;
	});
});

request(sentences, function(error, response) {
	if (!error) initialGameText = response.body;
	server.listen(port);
	console.log(`Serving ${root} on port ${port}`);
});
