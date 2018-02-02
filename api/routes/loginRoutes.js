'use strict'
module.exports = function (app) {
    var login = require('../controllers/loginController');
    app.route('/login')
        .post(login.authenticate);

    app.route('/login/reg')
        .post(login.create_a_user);

    //for future implementation
   /* app.route('/login/ver')
        .post(login.verify_a_user);*/
}