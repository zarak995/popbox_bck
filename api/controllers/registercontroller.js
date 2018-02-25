var mongoose = require('mongoose');
var User = mongoose.model('Users');
var TempUser = mongoose.model('TempUser');
exports.new_user = function (req, res) {
    var new_user = new User(req.body);
    if (req.body == null) {
        console.log('request body is empty');
        res.json({ status: 'failed', message: 'Please re enter your values and register' })
    } else {
        if (req.body.phone == null || !req.body.phone.length == 12) {
            console.log('request body is empty');
            res.json({ status: 'failed', message: 'Please re enter your values and register' })
        } else {
            if (req.body.email == null) {
                console.log('request body is empty');
                res.json({ status: 'failed', message: 'Please re enter your values and register' })
            } else {
                if (req.body.gender == null || !req.body.gender.length == 1) {
                    console.log('request body is empty');
                    res.json({ status: 'failed', message: 'Please re enter your values and register' })
                } else {
                    if (req.body.dateOfBirth == null) {
                        console.log('request body is empty');
                        res.json({ status: 'failed', message: 'Please re enter your values and register' })
                    } else {
                        if (req.body.password == null || req.body.password.length < 8) {
                            console.log('request body is empty');
                            res.json({ status: 'failed', message: 'Please re enter your values and register' })
                        } else {
                            new_user.save(function (err, user) {
                                if (err) {
                                    res.json({
                                        status: "failed",
                                        message: "Please use a different email address or phone number"
                                    })
                                } else {
                                    req.body.name = "Defaultious_" + Math.floor(Math.random() * 30000);
                                    req.body.user = user._id;
                                    createDefaultAvatar(req.body);
                                    var new_temp_user = new TempUser({
                                        userId: new_user._id,
                                        verificationCode: Math.floor(Math.random() * 31245)
                                    });
                                    new_temp_user.save(function (err, tempuser) {
                                        if (err) {
                                            console.log(err)
                                            res.json({
                                                status: "error",
                                                message: 'system error occured please try again later'
                                            })
                                        }
                                        else {
                                            console.log('user saved');
                                            sendVerificationEMAIL(new_user.email, new_user.name, new_temp_user.verificationCode);
                                            console.log("Temp user ID = " + tempuser._id);
                                            res.json({
                                                status: 'success',
                                                message: 'your account has been created',
                                                userId: tempuser._id
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    }
                }

            }

        }
    }
}


function createDefaultAvatar(body) {
    var new_avatar = new Avatar(body);
    new_avatar.save(function (err, avatar, res) {
        if (err) {
            console.log(err);
            res.json({
                status: "error",
                message: 'system error occured please try again later'
            })
        }
        else {
            if (new_avatar == null) {
                console.log('There was an error creating default_avatar');
            } else {
                console.log("Default Avatar has been created");
            }
        }
    });
}

function sendVerificationEMAIL(email, name, verificationCode) {
    var ses = require('node-ses')
        , client = ses.createClient({ key: 'AKIAJPFFPZFHBRTUGSPA', secret: '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' });
    // Give SES the details and let it construct the message for you.
    client.sendEmail({
        to: email
        , from: 'hi.ooxet@outlook.com'
        , subject: 'Verification Code'
        , message: '<strong>Hi ' + name + ' </strong> <br> Thank you for registering with <strong>oOxet.com</strong><br>'
            + 'This is your verification code '
            + "<div style=' color: blue; width:100%; font-size:150%; border:solid grey 1px;'>" + verificationCode + "</div>"
        , altText: 'plain text'
    }, function (err, data, res) {
        if (err) {
            console.log('There was an error in sende verification message /reg')
            console.log(err);
            res.json({
                status: "error",
                message: 'system error occured please try again later'
            })
        }
        else {
            console.log('verification email sent to user email')
            console.log(data);
        }
    });
}