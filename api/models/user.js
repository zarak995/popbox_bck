var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        minlength: 6,

    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        max: 1
    },
    email: {
        type: String,
        unique: true,
        required: true,
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
    isShowReported: {
        type: Boolean,
        required: true,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
})
.index({ email: 1, phone: 1 })
var User = mongoose.model('Users', UserSchema);
module.exports = User;