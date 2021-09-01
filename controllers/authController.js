const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', username: '', password: '', birthdayDay: '', birthdayMonth: '', birthdayYear: '' }

    if (err.code = 11000) {
        errors.email = 'EMAIL - Ten email jest już zajęty'
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
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
        res.cookie('username', user.username, { maxAge: maxAge * 1000 })
        res.status(200)
        res.redirect('/home')
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.register_get = (req, res) => {
    res.render('register');
}

// Register
module.exports.register_post = async (req, res) => {
    const { username, password, email, birthdayDay, birthdayMonth, birthdayYear } = req.body;

    console.log(req.body)

    try{
        const user = await User.create({ username, password, email, birthdayDay, birthdayMonth, birthdayYear })
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.cookie('username', user.username, { maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id});
        res.redirect('/home');
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// Logout
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/login')
}