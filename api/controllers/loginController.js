var env = process.env.NODE_ENV || 'development';
var config = require('../../env/config')[env];
var avatar = require('./avatarController');
var mongoose = require('mongoose'),
    sendEmail = require('../controllers/sendEmail');
User = mongoose.model('Users'),
    TempUser = mongoose.model('TempUser'),
    Sender = require('aws-sms-send'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    passportJWT = require('passport-jwt'),
    extractJWT = passportJWT.ExtractJwt,
    jwtStrategy = passportJWT.Strategy,
    User = require('../../api/models/user'),
    jwtOptions = {
        jwtFromRequest: extractJWT.fromHeader('authorization'),
        secretOrKey: config.secret
    },
    validator = require('validator');

var strategy = new jwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('Payload received', jwt_payload);
    var user = users[_.findIndex(users, {
        id: jwt_payload.id
    })];
    if (user) {
        next(null, user)
    } else {
        next,
            (null, false);
    }
});
exports.authenticate = function (req, res) {
    let error = {
        status: "error",
        message: 'system error occured please try again later'
    };

    let failed = {
        status: 'failed',
        message: 'username and/or password  is not valid'
    }

    if (req.body == null) {
        console.log('There was an error /login')
        console.log('body is empty');
        res.json(error)
    } else {
        if (req.body.username == '') {
            res.json(failed)
        } else {
            if (req.body.password == ''
                || req.body.password.length < 8) {
                res.json(failed)
            } else {
                console.log(req.body);
                User.findOne({
                    $or: [
                        { email: req.body.username },
                        { phone: req.body.username }
                    ]
                },
                    function (err, user) {
                        if (err) {
                            console.log('There was an error /login')
                            console.log(err)
                            res.json(error);
                        } else if (user == null) {
                            console.log("User is not registered");
                            res.json(failed);
                        } else if (user != null) {
                            if (user.active === false) {
                                TempUser.findOne({ userId: user._id },
                                    (err, tempuser) => {
                                        if (err) {
                                            console.log('There was an error on /login')
                                            console.log(err);
                                            res.json(error)
                                        } else {
                                            if (tempuser == null) {
                                                console.log('Tempuser is not found');
                                                res.json(failed)
                                            }
                                            else {
                                                console.log('user has not been verified');
                                                res.json({
                                                    status: 'verifywithcode',
                                                    message: "user has not been verfied yet",
                                                    userId: tempuser._id
                                                });
                                            }
                                        }
                                    })
                                return;
                            }

                            if (req.body.password) {
                                try {
                                    var isValid = compareToUserPassword(user.password, req.body.password);
                                    if (!isValid) {
                                        res.json(failed)
                                    } else if (isValid) {
                                        var payload = {
                                            id: user.id
                                        }
                                        var token = jwt.sign(payload, jwtOptions.secretOrKey);
                                        res.json({
                                            status: 'success',
                                            message: 'user has been logged on',
                                            token: token,
                                            user: user.id
                                        });
                                    }
                                } catch (try_error) {
                                    console.log('Error occurred at /login');
                                    console.log(try_error);
                                    res.json(error);
                                }

                            }
                        }
                    });
            }
        }
    }


}

function compareToUserPassword(userPassword, bodyPassword) {
    //write password hashing algorithm..... 
    if (bodyPassword === userPassword) {
        return true;
    }
    return false;
}

//For future implementation
exports.verify_a_user = function (req, res) {
    console.log(req.body);
    if (req.body == null) {
        res.json({
            status: 'error',
            message: 'system error occured please try again later'
        });
    } else {
        if (req.body.userId == null
            || req.body.userId == '') {
            console.log('userId is invalid');
            res.json({
                status: 'error',
                message: 'system error occured please try again later'
            });
        } else {
            if (req.body.code == null
                || req.body.code == ''
                || req.body.code.length > 5
                || req.body.code.length < 4) {
                res.json({
                    status: 'error',
                    message: 'system error occured please try again later'
                });
            } else {

                TempUser.findOne({
                    $and: [
                        { _id: req.body.userId },
                        { verificationCode: req.body.code }
                    ]
                },
                    function (err, tempuser) {
                        if (err) {
                            console.log("Error on /login/ver")
                            console.log(err)
                            res.json({
                                status: 'error',
                                message: 'system error occured please try again later'
                            });
                        }
                        else if (tempuser == null) {
                            res.json({
                                status: "failed",
                                message: "Please enter a valid verification code"
                            });
                        }
                        else if (tempuser.userId !== '') {
                            User.findByIdAndUpdate(tempuser.userId, {
                                $set: {
                                    active: true
                                }
                            },
                                (err, user) => {
                                    if (err) {
                                        console.log(err);
                                        res.json({
                                            status: "error",
                                            message: 'system error occured please try again later'
                                        });
                                    } else {
                                        if (user == null) {
                                            res.json({ status: 'failed', message: 'There was an error, Please validate again' })
                                        } else {
                                            TempUser.findByIdAndRemove(tempuser._id,
                                                (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.json({
                                                            status: "error",
                                                            message: 'system error occured please try again later'
                                                        })
                                                    } else {
                                                        console.log('Request Complete at ')
                                                        res.json({
                                                            status: 'success',
                                                            message: 'Your account has been activated, Please login'
                                                        })
                                                    }
                                                })
                                        }
                                    }
                                }
                            )
                        }
                    });
            }
        }
    }
    //update stattus on permanent db table

    //remove the temp_user record on temp table

}

//for future implementation
function sendVerificationSMS(phoneNumber, verificationCode) {
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
    sender.sendSms(config.aws_verification_code_message_body + verificationCode, config.aws_topic_sms, false, phoneNumber)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (err) {
            console.log(err)
        })
}



