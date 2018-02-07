var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Login = require('../controllers/loginController');

var usersProjections = {
    __v: false,
    password: false,
    username: false,
    createdDate: false,
    active: false,
    dateOfBirth: false,
    occupation: false,
    gender: false,
    phone: false,
    active: false,
    createdDate: false,
    avatar: false
}
exports.list_all_users = function (req, res) {
    User.find({}, function (err, user) {
        if (err)
            res.send(err)
        res.json(user);
    })
}

exports.view_a_user = function (req, res) {
    User.findById({ _id: req.params.userId }, function (err, user) {
        if (err)
            res.send(err)
        res.json(user);
    })
}

exports.update_a_user = function (req, res) {
    console.log("its here");
    User.findByIdAndUpdate(req.params.userId, {
        $set: {
            phone: req.body.phone,
            email: req.body.email,
            occupation: req.body.occupation
        }
    })
        .exec((err, user) => {
            console.log(user)
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(user);
                res.json(user);
            }
        })
}

exports.delete_a_user = function (req, res) {
    User.remove({ _id: req.params.userId }, function (err, user) {
        if (err)
            res.send(err)
        res.json({ message: 'User deleted successfully.' });
    })
}

exports.change_user_password = function (req, res) {
    User.findOne({ _id: req.params.userId })
        .exec((err, user) => {
            if (err) {
                console.log(err);
                res.send("There was an error please try again later")
            } else {
                if (req.body.password) {
                    var isValid = compareToUserPassword(user.password, req.body.password);
                    if (!isValid) {
                        res.json({
                            message: 'Please provide valid credentials'
                        });
                    } else if (isValid) {
                        User.findByIdAndUpdate({ _id: user._id },
                            {
                                $set: { password: req.body.newPassword }
                            }).exec((err, updated_user) => {
                                if (err) { res.send("There was a problem updating password please try again later") }
                                else {
                                    res.json('Your password has been updated')
                                }
                            })
                    }
                }
            }
        })
}

function compareToUserPassword(userPassword, bodyPassword) {
    if (bodyPassword === userPassword) {
        return true;
    }
    return false;
}