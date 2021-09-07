const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const socket = require('socket.io');
const server = app.listen(PORT);
const io = socket(server)
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

//Routes
const authRoutes = require('./routes/authRoutes');

//Models
const User = require('./models/user');
const { render } = require('ejs');

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(cookieParser());
mongoose.set('useCreateIndex', true);

//Connect to db
const dbURL = 'mongodb+srv://chatCordUser:Cqlmdc4OVscPGTSS@chatcord.etthk.mongodb.net/chatcord?retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected')
    })
    .catch((err) => {
        console.log(err);
    });

//View engines
app.set('view engine', 'ejs');

//Middlewares 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Static files
app.use(express.static('public'));

//ROUTES
app.get('*', checkUser)
app.get('/', requireAuth, (req, res) => {
    res.redirect('home')
})

//Home
app.get('/home', requireAuth, (req, res) => {
    res.render('home')
})

// Auth
app.use(authRoutes);

// Web socket
io.on('connection', (socket) => {
    console.log('New connection')

    // Welcome current user
    // socket.emit('message', 'Welcome to ChatCord!')

    // Broadcast when a user connect
    socket.broadcast.emit('message', 'User has joined.');

    io.on('disconnect', () => {
        // Broadcast when a user disconnect
        socket.broadcast.emit('message', 'User has left.')
    })

    // Types of messages
    // socket.emit() - to single client
    // socket.broadcast.emit() - to everyone except client
    // io.emit() - to everyone

    // Listen for chat message
    socket.on('chatMessage', (msgDetails) => {
        io.emit('message', msgDetails)
    })
})

//404
app.use((req, res) => {
    res.status(404).render('404');
})
  
