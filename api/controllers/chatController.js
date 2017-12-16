var mongoose = require('mongoose');
var Chat = mongoose.model('Chats');

exports.list_all_chats = function (req, res) {
    Chat.find()
        .populate({ path: 'likes', model: 'Avatars' })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({
            path: 'post',
            model: 'Posts',
            populate: {
                path: 'avatar',
                model: 'Avatars'
            }
        })
        .exec((err, chat) => {
            if (err) res.send(err);
            else {
                res.json(chat)
            }
        })
}
exports.view_a_chat = function (req, res) {
    Chat.findById({ _id: req.params.chatId })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({
            path: 'post', model: 'Posts',
            populate: {
                path: 'avatar',
                model: 'Avatars'
            }
        })
        .exec((err, chat) => {
            if (err) res.send(err);
            else {
                res.json(chat)
            }
        })
}
exports.create_a_chat = function (req, res) {
    var new_chat = new Chat(req.body);
    new_chat.save(function (err, chat) {
        if (err)
            res.send(err)
        else {
            res.json(new_chat);
        }
    });
}
exports.update_a_chat = function (req, res) {
    Chat.findByIdAndUpdate(req.params.chatId, {
        $set: {
            body: req.body.body,
            title: req.body.title,
            likes: req.body.likes
        }
    }, (err, chat) => {
        if (err) {
            console.log(err);
            res.send("There was an error");
        }
        else {
            this.view_a_chat
        }
    })
}
exports.delete_a_chat = function (req, res) {
    Chat.findByIdAndRemove({
        _id: req.params.chatId
    }, function (err, chat) {
        if (err)
            res.send(err)
        res.json({
            message: 'Chat has been deleted successfully.'
        });
    })
}