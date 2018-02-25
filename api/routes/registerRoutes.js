'use strict';
module.exports = function (app, data) {
    var register = require('../controllers/registercontroller');
    console.log();

    app.route('/reg')
    .post(register.new_user)
}
