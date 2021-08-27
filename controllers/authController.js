const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Handle errors
const handleErrors = (err) => {
    console.log(err.message)
}

const maxAge = 20 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, '&8*ws>tA>e(h/;<z6h.=;unK', {
        expiresIn: maxAge 
    })
}

// Login
module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = async (req, res) => {
    const { login, password } = req.body;

    console.log(login, password);
 
    try {
        const user = await User.login(login, password)
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.cookie('username', user.username, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200)
        res.redirect('/home')
    }
    catch (err) {
        res.status(400)
    }
}

module.exports.register_get = (req, res) => {
    res.render('register');
}

// Register
module.exports.register_post = async (req, res) => {
    const { username, password, email, dayOfBirth, monthOfBirth, yearOfBirth } = req.body;

    try{
        const user = await User.create({ username, password, email, dayOfBirth, monthOfBirth, yearOfBirth })
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.cookie('username', user.username, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200);
        res.redirect('/home');
    }
    catch (err) {
        handleErrors(err);
        res.status(400).send('Something went wrong..');
    }
}

// Logout
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/login')
}