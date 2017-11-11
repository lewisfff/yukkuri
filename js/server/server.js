
const http = require('http');
const serve = require('koa-static');
const koa = require('koa');
const socket = require('socket.io');

const pub = '../../public';
const root = `${__dirname}/${pub}`;
const port = process.env.PORT || 3000;

const app = new koa();
const server = http.createServer(app.callback());
const io = socket(server); 

app.use(serve(root));
app.listen(port);

console.log(`Serving ${root} on port ${port}`);

io.on('connection', function(socket) {
	console.log('a user connected');
});
