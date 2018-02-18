var ses = require('node-ses');
var mongoose = require('mongoose'),
    TempUser = mongoose.model('TempUser'),
    User = mongoose.model('Users');
exports.send_email = function (req, res) {
    console.log("Email Sent");
    console.log(req.body);
    TempUser.findById(req.body.userId, (err, tempuser) => {
        if (err) {
            console.log(err);
            res.send("There was an error please try again later");
        } else {
            console.log(tempuser);
            User.findById(tempuser.userId, (err, user) => {
                var client = ses.createClient({ key: 'AKIAJPFFPZFHBRTUGSPA', secret: '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' });
                client.sendEmail({
                    to: user.email
                    , from: 'hi.ooxet@outlook.com'
                    , subject: 'Verification Code'
                    , message: '<strong>Hi ' + user.name + ' </strong> <br> Thank you for registering with <strong>oOxet.com</strong><br>'
                        + 'This is your verification code '
                        + "<div style=' color: blue; width:100%; font-size:150%; border:solid grey 1px;'>" + tempuser.verificationCode + "</div>"
                    , altText: 'plain text'
                }, function (err, data) {
                    if (err) { console.log(err) }
                    else {
                        res.send("Verification code has been sent");
                    }
                });
            })
        }
    })
}

exports.send_sms = function (req, res) {
    console.log("SMS Sent");
    console.log(req.body.phone);
}