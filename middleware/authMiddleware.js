const jwt = require('jsonwebtoken')
const User = require('../models/user');
const app = require('../app')

let activeUsers = []

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, '&8*ws>tA>e(h/;<z6h.=;unK', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login')
            } else {
                console.log(decodedToken);
                let userId = decodedToken.id
                await User.findById(userId)
                    .then(res => {
                        let isUserExist = false
                        console.log('== auth ==')
                        console.log(activeUsers)
                        activeUsers.forEach(user => {
                            console.log('username check: ' + user[0] + ' ' + res.username)
                            if (user[0] == res.username) {
                                console.log('checked')
                                isUserExist = true
                                return true
                            }
                        })

                        console.log('isUserExist ' + isUserExist)
                        if (isUserExist == false) {
                            activeUsers.push( [res.username, res.avatarURL] )
                            console.log('added users to list')
                        }

                        // if (activeUsers.includes([res.username, res.avatarURL]) == false) {
                        //     activeUsers.push( [res.username, res.avatarURL] )
                        //     console.log('added users to list')
                        // }

                        console.log('== auth end ==')
                    })
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    var currView = req.originalUrl;

    if (token) {
        jwt.verify(token, '&8*ws>tA>e(h/;<z6h.=;unK', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                next()
            } else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                if ( currView == '/login' || currView == '/register') {
                    res.redirect('/home')
                }
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser, activeUsers }