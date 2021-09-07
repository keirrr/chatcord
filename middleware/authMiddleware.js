const jwt = require('jsonwebtoken')
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, '&8*ws>tA>e(h/;<z6h.=;unK', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login')
            } else {
                console.log(decodedToken);
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

module.exports = { requireAuth, checkUser }