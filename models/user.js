const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        min: [4, 'NAZWA UŻYTKOWNIKA - Musi być pomiędzy 4 a 32 długości'],
        max: [32, 'NAZWA UŻYTKOWNIKA - Musi być pomiędzy 4 a 32 długości'],
        required: [true, 'NAZWA UŻYTKOWNIKA - Wprowadź nazwę użytkownika']
    },
    password: {
        type: String,
        minlength: [6, 'HASŁO - Minimalna długość hasła to 6 znaków'],
        required: [true, 'HASŁO - Wprowadź hasło']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'ADRES E-MAIL - Wprowadź adres email'],
        validate: [isEmail, 'ADRES E-MAIL - Wprowadź poprawny adres email']
    },
    birthdayDay: {
        type: Number,
        min: [1, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia'],
        max: [31, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia'],
        required: [true, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia']
    },
    birthdayMonth: {
        type: Number,
        min: [1, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia'],
        max: [12, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia'],
        required: [true, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia']
    },
    birthdayYear: {
        type: Number,
        min: [1920, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia'],
        max: [2008, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia'],
        required: [true, 'DATA URODZENIA - Wprowadź poprawną datę urodzenia']
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