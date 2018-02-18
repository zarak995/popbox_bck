'use strict'
module.exports = function (app) {
    var login = require('../controllers/loginController');
    var sendEmail = require('../controllers/sendEmail');
    console.log()
    console.log('LOGIN');
    console.log('Login /login');
    console.log('Register /login/reg');
    console.log('Verification /login/ver');
    console.log('Verification Resend Email /login/reg/resendEmail');
    console.log('Verification Resend Email /login/reg/resendSMS');
    
    app.route('/login')
        .post(login.authenticate);

    app.route('/login/reg')
        .post(login.create_a_user);

    app.route('/login/ver')
        .post(login.verify_a_user);

    app.route('/login/reg/resendEmail')
        .post(sendEmail.send_email);

    app.route('/login/reg/resendSMS')
        .post(sendEmail.send_sms);
}