const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please enter a username']
    },
    password: {
        type: String,
        minlength: [6, 'Minimum password length is 6 characters'],
        required: [true, 'Please enter a password']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please enter an email'],
        validate: [isEmail, 'Please enter a valid email']
    },
    dayOfBirth: {
        type: Number,
        required: [false, 'Please enter a day of birth']
    },
    monthOfBirth: {
        type: Number,
        required: [false, 'Please enter a month of birth']
    },
    yearOfBirth: {
        type: Number,
        required: [false, 'Please enter a year of birth']
    }
    }, {timestamps: true}
);

// Hash password
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Static method to login user
userSchema.statics.login = async function(login, password) {
    const user = await this.findOne({ email: login });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user
        }
        throw Error('Niepoprawne hasło')
    }
    throw Error('Niepoprawny adres email')
}

const User = mongoose.model('User', userSchema);
module.exports = User;