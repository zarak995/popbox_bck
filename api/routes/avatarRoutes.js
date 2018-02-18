'use-strict'
module.exports = function (app, data) {
    var avatar = require('../controllers/avatarController');
    console.log();
    console.log("Current Avatar GET /avatars/:userId")
    console.log("Create Avatat POST /avatars/:userId")
    
    app.route('/avatars/:userId')
        .get(avatar.get_current_avatar)
        .post(avatar.create_an_avatar);
}