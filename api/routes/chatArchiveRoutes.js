'use-strict'
module.exports = function (app) {
    console.log("on archive");
    var chatArchive = require('../controllers/chatArchiveController');

    app.route('/admin/archive/chats')
        .post(chatArchive.create_new_archive);
}