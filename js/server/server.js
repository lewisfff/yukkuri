
const http = require('http');
const serve = require('koa-static');
const koa = require('koa');
const socket = require('socket.io');
const request = require('request');

const token = require('./token.js');

const sentences = 'http://metaphorpsum.com/sentences/20'
const pub = '../../public';
const root = `${__dirname}/${pub}`;
const port = process.env.PORT || 3000;

const app = new koa();
app.use(serve(root));

const server = http.createServer(app.callback());
const io = socket(server); 

let initialGameText = null;

io.on('connection', function(socket) {
	let room = token.generateUnique(io);
	let name = 'anonymous';
	let text = initialGameText;
	socket.join(room);
	socket.emit('token', room);
	console.log(`${name} connected to ${room}`);

	socket.on('disconnect', function() {
		console.log(`${name} disconnected from ${room}`);
		//socket.broadcast.to(room).emit('disconnect', socket.id)
	});

	socket.on('join', function(token) {
		if (!io.sockets.adapter.rooms.hasOwnProperty(token))
			return;
		let room = io.sockets.adapter.rooms[token];
		if (room.length !== 1)
			return;
		socket.leave(room);
		room = token;
		socket.join(room);
		socket.emit('token', room);
		console.log(`${name} joined room: ${room}`);
	});

	socket.on('start', function() {
		console.log(`game starting in ${room}`);
		//socket.broadcast.to(room).emit('start', text);
		io.to(room).emit('start', text);
		request(sentences, function(error, response) {
			text = response;
		});
	});
});

request(sentences, function(error, response) {
	if (!error) initialGameText = response.body;
	server.listen(port);
	console.log(`Serving ${root} on port ${port}`);
});
