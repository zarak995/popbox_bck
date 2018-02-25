var mongoose = require('mongoose');
Avatar = mongoose.model('Avatars'),
    Chat = mongoose.model('Chats');

exports.list_all_posts = function (req, res) {
    Post.find({}, function (err, post) {
        if (err)
            res.send(err)
        res.json(post);
    });
}
exports.view_a_post = function (req, res) {
    Post.findById({ _id: req.params.postId }, function (err, post) {
        if (err)
            res.send(err)
        res.json(post);
    })
}

exports.create_new_post = function (req, res) {
    Chat.findById({ _id: req.body.chat })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({ path: 'likes', model: 'Avatars' })
        .exec((err, chat) => {
            if (err) {
                console.log(err);
                res.send("There was an erro saving post");
            } else {
                var avatar = Avatar.findById({ _id: req.body.avatar }, function (err, avatar) {
                    if (err) {
                        console.log(err)
                        res.send("There was an error")
                    }
                    else {
                        req.body.avatar = avatar;
                        chat.post = chat.post.concat(req.body);
                        chat.save(function (err, chat) {
                            if (err) { console.log(err) }
                            else {
                                res.json(chat);
                            }
                        })
                    }
                });

            }
        })
}

exports.update_a_post = function (req, res) {
    Chat.findById({ _id: req.params.chatId })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({ path: 'likes', model: 'Avatars' })
        .exec((err, chat) => {
            if (err) {
                console.log(err);
                res.send("There was an error deleting post");
            } else {
                let maxPosts = chat.post.length;
                for (var x = 0; x < maxPosts; x++) {
                    if (chat.post[x]._id == req.params.postId) {
                        chat.post[x].reports = req.body.reports;
                        chat.post[x].body = req.body.body;
                        chat.save(function (err, chat) {
                            if (err) { console.log(err) }
                            else {
                                res.json(chat);
                                return;
                            }
                        })
                        break;
                    }
                }
            }
            return;
        })
    return;
}


exports.delete_a_post = function (req, res) {
    console.log(req.params);
    Chat.findById({ _id: req.params.chatId })
        .populate({ path: 'owner', model: 'Avatars' })
        .populate({ path: 'likes', model: 'Avatars' })
        .exec((err, chat) => {
            if (err) {
                console.log(err);
                res.send("There was an error deleting post");
            } else {
                let maxPosts = chat.post.length;
                for (var x = 0; x < maxPosts; x++) {
                    if (chat.post[x]._id == req.params.postId) {
                        chat.post.splice(x, 1);
                        chat.save(function (err, chat) {
                            if (err) { console.log(err) }
                            else {
                                res.json(chat);
                                return;
                            }
                        })
                        break;
                    }
                }
            }
            return;
        })
    return;
}
