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

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    res.render('create');
    
    // Send new mover data to client
    io.emit('newMover', req.body);
});
