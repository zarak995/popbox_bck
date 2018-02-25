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
    };

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
                res.json({
                    status: "error",
                    message: 'system error occured please try again later'
                })
            } else if (user === null) {
                console.log("User is not registered");
                res.json({
                    status: 'failed',
                    message: 'username and/or password  is not valid'
                });
            } else if (user !== null) {
                if (user.active === false) {
                    TempUser.findOne({ userId: user._id },
                        (err, tempuser) => {
                            if (err) {
                                console.log('There was an error on /login')
                                console.log(err);
                                res.json({
                                    status: "error",
                                    message: 'system error occured please try again later'
                                })
                            } else {
                                if (tempuser === null) {
                                    console.log('Tempuser is not found');
                                    res.json({
                                        status: "failed",
                                        message: 'please cancel and try to login again'
                                    })
                                }
                                else {
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
                            res.json({
                                status: 'failed',
                                message: 'username and/or password  is not valid'
                            });
                        } else if (isValid) {
                            var payload = {
                                id: user.id
                            }
                            var token = jwt.sign(payload, jwtOptions.secretOrKey);
                            res.json({
                                status:'success',
                                message: 'user has been logged on',
                                token: token,
                                user: user.id
                            });
                        }
                    } catch (error) {
                        console.log('Error occurred at /login');
                        console.log(error);
                        res.status('error')
                            .json({
                                message: 'system error occured please try again later'
                            })
                    }

                }
            }
        });
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
    console.log("here");
    console.log(req.body);
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
                                                message: 'Your account has been activated'
                                            })
                                        }
                                    })
                            }
                        }
                    }
                )
            }
        });
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



