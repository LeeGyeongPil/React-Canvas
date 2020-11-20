const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', } });

app.get('/socket.io/', function (req, res) {
});

io.on('connection', (socket) => {
	console.log('connect');
	socket.on('draw', (msg) => {
		io.emit('drawing', msg);
	});
});

server.listen(3001, 
	function(){ 
		console.log('Server Running...');
	}
);