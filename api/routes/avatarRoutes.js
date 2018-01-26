'use-strict'
module.exports = function (app, data) {
    var avatar = require('../controllers/avatarController');
    app.route('/avatars/:userId')
        .get(avatar.get_current_avatar)
        .post(avatar.create_an_avatar);
}