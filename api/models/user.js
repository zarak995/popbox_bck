var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    occupation: {
        type: String
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    avatar: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avatars',
        required: true
    }],
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

var User = mongoose.model('Users', UserSchema);
module.exports = User;