var env = process.env.NODE_ENV || 'development';
var config = require('../../env/config')[env];
var avatar = require('./avatarController');
var mongoose = require('mongoose'),
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
                res.send(err)
            } else if (user === null) {
                res.send({
                    message: 'The username provided is not registered on our system'
                });
            } else if (user !== null) {
                console.log('Console Log');
                /***
                  if (user.active === false) {
                      console.log("inactive user")
                      res.json({ code: '401', message: "user has not been verfied yet", uid: user._id });
                      return;
                  }
                   */
                if (req.body.password) {
                    var isValid = compareToUserPassword(user.password, req.body.password);
                    if (!isValid) {
                        res.json({
                            message: 'Please provide valid credentials'
                        });
                    } else if (isValid) {
                        var payload = {
                            id: user.id
                        }
                        var token = jwt.sign(payload, jwtOptions.secretOrKey);
                        console.log(token);
                        res.json({
                            message: 'Ok',
                            token: token,
                            user: user.id
                        });
                    } else {
                        res.status(401).json({
                            message: ' Passwords did not match',
                        });
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
        userId: req.body.userId
    },
        function (err, tempuser) {
            if (err) res.json({ message: "There was a problem please try again later" })
            else if (tempuser.userId !== '') {
                console.log(tempuser)
                User.findByIdAndUpdate(tempuser.userId, {
                    $set: {
                        active: true
                    }
                },
                    (err, user) => {
                        if (err) {
                            console.log(err);
                            res.json({ message: "There was a problem, please try again later" });
                        } else {
                            TempUser.findByIdAndRemove(tempuser._id,
                                (err) => {
                                    if (err) {
                                        console.log(err);
                                        res.json({ message: "There was an error please try again later" })
                                    } else {
                                        console.log('user has been activated')
                                    }
                                })
                            res.json({ message: "Account has been verified" })
                        }
                    }
                )
            } else {
                console.log(tempuser.userId)
                res.send('There was a problem')
            }
        });
    //update stattus on permanent db table

    //remove the temp_user record on temp table

}

exports.create_a_user = function (req, res) {
    var new_user = new User(req.body);
    console.log(req.body);
    new_user.save(function (err, user) {
        if (err) res.json({ code: "11000", message: "Please use a different email address or phone number" })
        else {
            req.body.name = "Defaultious_" + Math.floor(Math.random() * 30000);
            req.body.user = user._id;
            avatar.create_an_avatar(req, res);
            /*var new_temp_user = new TempUser({
                userId: new_user._id, verificationCode: Math.floor(Math.random() * 31245)
            });
            new_temp_user.save(function (err, Tempuser) {
                if (err) {
                    console.log(err)
                    res.send("There was an error please try again later");
                }
                else {
                    console.log('user saved');
                    sendVerificationSMS(new_user.phone, new_temp_user.verificationCode);
                }
            })*/
        }
    })
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