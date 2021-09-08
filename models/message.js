const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema ({
    author: {
        type: String,
        min: 4,
        max: 32,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;