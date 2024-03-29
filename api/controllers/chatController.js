var moment = require('moment');
var mongoose = require('mongoose');
var Chat = mongoose.model('Chats');

let error = {
    status: "error",
    message: 'system error occured please try again later'
};

let failed = {
    status: 'failed',
    message: 'username and/or password  is not valid'
}
exports.list_top_chats = function (req, res) {
    Chat.find().sort({ post: -1 }).limit(15)
        .populate({ path: 'likes', model: 'Avatars' })
        .populate({ path: 'owner', model: 'Avatars' })
        .exec((err, chat) => {
            if (err) {
                console.log(err)
                res.json(error)
            }
            else {
                res.json(chat)
            }
        })
}
exports.list_all_chats = function (req, res) {
    Chat.find().sort({ _id: -1 })
        .populate({ path: 'likes', model: 'Avatars' })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({ path: 'reports', model: 'Avatars' })
        .exec((err, chat) => {
            if (err) {
                console.log(err)
                res.json(error)
            }
            else {
                res.json(chat)
            }
        })
}
exports.view_a_chat = function (req, res) {
    Chat.findById({ _id: req.params.chatId })
        .populate({ path: 'likes', model: 'Avatars' })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({ path: 'reports', model: 'Avatars' })
        .populate({
            path: 'post', model: 'Posts',
            populate: {
                path: 'avatar',
                model: 'Avatars'
            }
        })
        .exec((err, chat) => {
            if (err) {
                console.log(err)
                res.json(error)
            } else {
                res.json(chat)
            }
        })
}
exports.create_a_chat = function (req, res) {
    var new_chat = new Chat(req.body);
    new_chat.save(function (err, chat) {
        if (err) {
            console.log(err)
            res.json(error)
        }
        else {
            req.params.chatId = chat._id;
            module.exports.view_a_chat(req, res);
        }
    })
}
exports.update_a_chat = function (req, res) {
    if (req.body == null) {
        console.log('req body is null or undefined');
        res.json(error)
    } else {
        if (req.body.body == null
            || req.body.body == '') {
            console.log('req chat.body is null or undefined');
            res.json(error)
        } else {
            if (req.params.chatId == null
                || req.params.chatId == '') {
                console.log('req chat._id is null or undefined');
                res.json(error);
            } else {
                if (req.body.likes == null
                    || req.body.likes == ['']) {
                    console.log('req chat.body is null or undefined');
                    res.json(error)
                } else {
                    if (req.params.chatId == null
                        || req.params.chatId == '') {
                        res.json(error);
                    } else {
                        Chat.findByIdAndUpdate(req.params.chatId, {
                            $set: {
                                body: req.body.body,
                                title: req.body.title,
                                likes: req.body.likes,
                                reports: req.body.reports
                            }
                        })
                            .populate({ path: 'owner', model: 'Avatars' })
                            .populate({
                                path: 'post', model: 'Posts',
                                populate: {
                                    path: 'avatar',
                                    model: 'Avatars'
                                }
                            })
                            .exec((err, chat) => {
                                if (err) {
                                    console.log(err)
                                    res.json(error)
                                }
                                else {
                                    req.params.chatId = chat._id;
                                    module.exports.view_a_chat(req, res)
                                }
                            })
                    }
                }
            }
        }
    }


}
exports.delete_a_chat = function (req, res) {
    Chat.findByIdAndRemove({ _id: req.params.chatId })
        .exec(function (err, chat) {
            if (err) {
                console.log(err)
                res.json(error)
            }
            else {
                res.json(chat);
            }
        })
}
exports.user_chats = function (req, res) {
    Chat.find({}).sort({ _id: -1 })
        .populate({ path: 'likes', model: 'Avatars' })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({ path: 'reports', model: 'Avatars' })
        .exec((err, list) => {
            if (err) {
                console.log(err)
                res.json(error)
            }
            else {
                let maxLength = list.length;
                let responseList = [];
                for (var x = 0; x < maxLength; x++) {
                    if (list[x].owner.user == req.params.userId) {
                        responseList.push(list[x]);
                    }
                }
                res.json(responseList);
            }
        })
}