const express = require('express');
const socket = require('socket.io');

// Server setup
const app = express();
let server = app.listen(process.env.PORT || 8080);

app.set('view engine', 'pug');
app.use(express.static('static_files'));
app.use(express.json());
app.use(express.urlencoded());

// Sockets.io
let io = socket(server);

io.sockets.on('connection', (socket) => {
    socket.on('newSubmit', (m) => {
        io.emit('newMover', m);
    });
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});