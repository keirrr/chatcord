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

//ROUTES
const authRoutes = require('./routes/authRoutes');

// MODELS
// User
const User = require('./models/user');
const { render } = require('ejs');
// Message
const Message = require('./models/user')

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(cookieParser());
mongoose.set('useCreateIndex', true);

//Connect to db
const dbURL = 'mongodb+srv://chatCordUser:Cqlmdc4OVscPGTSS@chatcord.etthk.mongodb.net/chatcord?retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database')
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

let activeUsers = []

// Web socket
io.on('connection', (socket) => {
    //console.log('New connection')
    //console.log(socket.client.conn.server.clientsCount + " users connected");

    // Active users Amount
    let activeUsersAmount = socket.client.conn.server.clientsCount
    //let username = activeUsers[activeUsersAmount - 1].username

    io.emit('activeUsersAmount', activeUsersAmount)

    // Active users list info
    io.emit('activeUsersInfo', activeUsers)

    let username = ''
    setTimeout(() => {
        username = activeUsers[activeUsersAmount - 1]
        if (username != '') {
            console.log('xd')
            console.log(username)
        } else {
            console.log('null')
        }
    }, 200)

    socket.on('disconnect', (socket) => {
        //console.log('Disconnected')
        // Connected users amount
        console.log('dc: ' + username)
        activeUsers = activeUsers.filter(user => user != username)
        console.log(activeUsers)
    
        io.emit('activeUsersAmount', activeUsersAmount)
        io.emit('activeUsersInfo', activeUsers)

        activeUsersAmount--
    })

    // Listen for chat message
    socket.on('chatMessage', (msgDetails) => {
        io.emit('message', msgDetails)
        console.log(msgDetails)

    })
})

//404
app.use((req, res) => {
    res.status(404).render('404');
})

exports.activeUsers = activeUsers
  
