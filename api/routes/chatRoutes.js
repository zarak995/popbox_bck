'use scrict'
module.exports = function (app, data) {
    var mongoose = require('mongoose');
    console.log()
    console.log('CHATS');
    console.log('All Chats  /chats');
    console.log('Top Chats /chats/top/chats');
    console.log('User Chats /chat/users/:user/Id');
    console.log('View Chat /chats/:chatID');

    var chat = require('../controllers/chatController'),
        login = require('../controllers/loginController');

    app.route('/chats')
        .get(chat.list_all_chats)
        .post(chat.create_a_chat);

    app.route('/chats/top/chats')
        .get(chat.list_top_chats);

    app.route('/chats/users/:userId')
        .get(chat.user_chats);

    app.route('/chats/:chatId')
        .get(chat.view_a_chat)
        .put(chat.update_a_chat)
        .delete(chat.delete_a_chat);


}
