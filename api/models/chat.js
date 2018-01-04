var mongoose = require('mongoose');
var Post = mongoose.Schema({
    avatar: Object,
    createdDate: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String,
        require: true
    },
});

var ChatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avatars'
    }],
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avatars'
    }],
    post: [Post],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avatars'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String]
    }

});
ChatSchema.index({ body: 'text', 'post.body': 'text' });
var Chat = mongoose.model('Chats', ChatSchema);
module.exports = Chat;
