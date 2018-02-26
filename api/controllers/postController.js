var mongoose = require('mongoose');
Avatar = mongoose.model('Avatars'),
    Chat = mongoose.model('Chats');

let error = {
    status: "error",
    message: 'system error occured please try again later'
};

let failed = {
    status: 'failed',
    message: 'username and/or password  is not valid'
}

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
    if (req.body == null) {
        console.log('request body is empty or undefined');
        res.json(error)
    } else {
        if (req.body.chat == null
            || req.body.chat == ' ') {
            console.log('request chat is empty or undefined');
            res.json(error);
        } else {
            if (req.body.avatar == null
                || req.body.avatar == '') {
                console.log('request avatar is empty or undefined');
                res.json(error);
            } else {
                if (req.body.body == null
                    || req.body.body == '') {
                    console.log('request postbody is empty or undefined');
                    res.json(error);
                } else {
                    Chat.findById({ _id: req.body.chat })
                        .populate({ path: 'owner', model: 'Avatars' })
                        .populate({ path: 'likes', model: 'Avatars' })
                        .exec((err, chat) => {
                            if (err) {
                                console.log(err);
                                res.json(error)
                            } else {
                                if (chat == null) {
                                    console.log('There was an error finding the chat that was commented on');
                                    res.json(failed);
                                    return;
                                }
                                console.log("Hello bobstar");
                                console.log(req.body.avatar);
                                var avatar = Avatar.findById({ _id: req.body.avatar }, function (err, avatar) {
                                    if (err) {
                                        console.log(err)
                                        res.json(error);
                                        return;
                                    }
                                    else {
                                        if (avatar == null) {
                                            console.log('There was an error finding the avatar that made a comment');
                                            res.json(failed);
                                            return;
                                        } else {
                                            req.body.avatar = avatar;
                                            chat.post = chat.post.concat(req.body);
                                                chat.save(function (err, chat) {
                                                if (err) {
                                                    console.log(err)
                                                    res.json(error);
                                                }
                                                else {
                                                    res.json(chat);
                                                }
                                            })
                                        }

                                    }
                                });

                            }
                        })
                }
            }
        }
    }

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
