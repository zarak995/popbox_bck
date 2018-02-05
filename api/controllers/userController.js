var mongoose = require('mongoose'),
    User = mongoose.model('Users');

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
            email: req.body.email
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

exports.change_user_password = function () {

}