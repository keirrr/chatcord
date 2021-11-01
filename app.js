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
const emoji = require('node-emoji')
const fs = require('fs');

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
    // Socket id
    console.log(socket.id)

    // Active users Amount
    //console.log(global.activeUsers)
    let activeUsersAmount = global.activeUsers.length
    //console.log('active users - ' + activeUsersAmount)

    //console.log('Connected!')
    io.emit('activeUsersAmount', activeUsersAmount)

    let username = ''
    let usernameAvatarUrl = ''

    const userExist = setInterval(() => {
        //console.log(global.activeUsers)
        if (global.activeUsers[activeUsersAmount - 1] != undefined) {
            console.log('exist')

            let userInfo = global.activeUsers[activeUsersAmount - 1]
            username = userInfo[0]
            usernameAvatarUrl = userInfo[1]
            if (userInfo.length == 2)
                userInfo.push(socket.id)
            else
                userInfo[2] = socket.id


            // Active users list info
            io.emit('activeUsersInfo', global.activeUsers)

            // Update user avatar
            io.to(socket.id).emit('updateUserAvatar', usernameAvatarUrl)

            // Get messages history
            let messagesFile = fs.readFileSync("./fs/chat-messages/public/main/channels/glowny.json")
            let messages = JSON.parse(messagesFile);

            io.to(socket.id).emit('updateMessages', messages);

            clearInterval(userExist)
        }

        setTimeout(() => {
            clearInterval(userExist)
        }, 1000)
    }, 200)

    // Listen for chat message
    socket.on('chatMessage', (msgDetails) => {
        var format = function (code, name) {
            return '<span class="emoji text-xl">' + code + '</span>';
        };
        const msg = emoji.emojify(emoji.unemojify(msgDetails.msg), null, format);

        const usr = msgDetails.usr;
        const avk = usernameAvatarUrl;

        const timestamp = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]

        // Get messages JSON file
        let messagesFile = fs.readFileSync("./fs/chat-messages/public/main/channels/glowny.json")
        let messages = JSON.parse(messagesFile);
        
        let msgId = 1
        if (messages.messages.length > 0)
            msgId = messages.messages[messages.messages.length - 1].msgId + 1

        let msgDetails2 = {
            msg,
            msgId,
            usr,
            avk,
            timestamp
        }

        io.emit('message', msgDetails2)

        // Push new message to JSON
        messages.messages.push(msgDetails2)
        let newMessage = JSON.stringify(messages);
        async function saveFile() {
            await fs.writeFile("./fs/chat-messages/public/main/channels/glowny.json", newMessage, (err) => {
                if (err) throw err;
                //console.log("Added new message");
            })
        }

        saveFile();

        //console.log(messages)
        //console.log(msgDetails2)
    })

    // Private message
    socket.on('privateMessage', (msgDetails) => {
        let userId = (global.activeUsers.find(user => user[0] == "john2"))[2]
        
        io.to(userId).emit('privateMessage', msgDetails)
    })

    // Disconnect
    socket.on('disconnect', (socket) => {
        // Connected users amount
        //console.log('dc: ' + username)
        let activeUsersAfterDc = global.activeUsers.filter(user => user[0] != username)
        global.activeUsers = activeUsersAfterDc
        //console.log(global.activeUsers)

        io.emit('activeUsersAmount', activeUsersAmount)
        //console.log('update users list after dc')
        io.emit('activeUsersInfo', global.activeUsers)
    })
})

//404
app.use((req, res) => {
    res.status(404).render('404')
})
