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
const authMiddleware = require('./middleware/authMiddleware')

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

// Web socket
io.on('connection', (socket) => {
    // Active users Amount
    let activeUsersAmount = socket.client.conn.server.clientsCount
    console.log('active users - ' + activeUsersAmount)

    console.log('Connected!')
    io.emit('activeUsersAmount', activeUsersAmount)

    let username = ''
    //
    // po odświeżeniu strony zwiększa liczbę użytkownikow
    //
    const userExist = setInterval(() => {
        console.log('== userExist ==')
        console.log(authMiddleware.activeUsers)
        if (authMiddleware.activeUsers[activeUsersAmount - 1] != undefined) {
            console.log('exist')
            //console.log(authMiddleware.activeUsers[activeUsersAmount - 1])

            let userInfo = authMiddleware.activeUsers[activeUsersAmount - 1]
            username = userInfo[0]
            //console.log(username)

            // Active users list info
            //console.log('update users list')
            io.emit('activeUsersInfo', authMiddleware.activeUsers)

            clearInterval(userExist)
        }
    }, 100)

    socket.on('disconnect', (socket) => {
        // Connected users amount
        console.log('dc: ' + username)
        authMiddleware.activeUsers = authMiddleware.activeUsers.filter(user => user[0] != username)
        console.log(authMiddleware.activeUsers)
    
        io.emit('activeUsersAmount', activeUsersAmount)
        console.log('update users list after dc')
        io.emit('activeUsersInfo', authMiddleware.activeUsers)

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
    res.status(404).render('404')
})
