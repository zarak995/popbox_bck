var ses = require('node-ses');
var mongoose = require('mongoose'),
    TempUser = mongoose.model('TempUser'),
    User = mongoose.model('Users');
var env = process.env.NODE_ENV || 'production';
var config = require('../../env/config')[env];
var Tempuser = mongoose.model('TempUser');
var Sender = require('aws-sms-send');
var sms_config = {
    AWS: {
        accessKeyId: config.aws_accessKeyId,
        secretAccessKey: config.aws_secretAccessKey,
        region: config.aws_region
    }
};

var sender = new Sender(sms_config);
exports.send_email = function (req, res) {
    TempUser.findById(req.body.userId, (err, tempuser) => {
        if (err) {
            console.log(err);
            res.json({ status: 'error', message: 'system error occured please try again later' });
        } else {
            if (tempuser == null) {
                console.log("tempuser does not exist");
                res.json({ status: 'failed', message: 'There was an error, please select resend again' });
            } else {
                User.findById(tempuser.userId, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.json({ status: 'error', message: 'system error occured please try again later' });
                    } else {
                        if (user == null) {
                            console.log("user does not exist");
                            res.json({ status: 'failed', message: 'There was an error, please select resend again' });
                        } else {
                            var client = ses.createClient({ key: 'AKIAJPFFPZFHBRTUGSPA', secret: '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' });
                            client.sendEmail({
                                to: user.email
                                , from: 'hi.ooxet@outlook.com'
                                , subject: 'Verification Code'
                                , message: '<strong>Hi ' + user.name + ' </strong> <br> Thank you for registering with <strong>oOxet.com</strong><br>'
                                    + 'This is your verification code '
                                    + "<div style=' color: blue; width:100%; font-size:150%; border:solid grey 1px;'>" + tempuser.verificationCode + "</div>"
                                , altText: 'plain text'
                            }, (err, data) => {
                                if (err) {
                                    console.log("Error on login/reg/resendEMAIL")
                                    console.log(err)
                                    res.json({ status: 'error', message: 'system error occured please try again later' });
                                }
                                else if (data != null) {
                                    res.json({ status: 'success', message: "verification code has been sent" });
                                    console.log("Request Complete on login/reg/resendEMail")
                                } else {
                                    res.json({ status: 'error', message: 'system error occured please try again later' });
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

exports.send_sms = function (req, res) {
    TempUser.findById(req.body.userId, (err, tempuser) => {
        if (err) {
            console.log(err);
            res.json({ status: 'error', message: 'system error occured please try again later' });
        } else {
            if (tempuser == null) {
                console.log("tempuser does not Exist");
                res.json({ status: 'failed', message: 'There was an error, please select resend again' });
            } else {
                User.findById(tempuser.userId, (err, user) => {
                    if (err) {
                        console.log(err)
                        res.send("There was an error");
                    } else {
                        if (user == null) {
                            console.log("User does not Exist");
                            res.json({ status: 'failed', message: 'There was an error, please select resend again' });
                        } else {
                            sender.sendSms(config.aws_verification_code_message_body + tempuser.verificationCode,
                                config.aws_topic_sms, false, user.phone)
                                .then(function (response) {
                                    console.log(response);
                                    res.json({ status: 'success', message: 'verification code has been sent to your Phone' });
                                    console.log("Request Complete on login/reg/resendSMS")
                                    console.log();
                                })
                                .catch(function (err) {
                                    res.json({ status: 'error', message: 'system error occured please try again later' });
                                    console.log("Error on login/reg/resendSMS")
                                    console.log(err)
                                })
                        }
                    }
                })
            }
        }
    })
}