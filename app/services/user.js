var crypto = require('crypto');
var multer = require('multer');
var User = require('../models/user');
var config = require('../../config');

module.exports = {

    getUserByToken: function(token) {
        return User.findOne({ token: token }).exec();
    },


    logout: function(userId) {
        return User
                .findOne({ _id: userId })
                .exec()
                .then(function(user) {
                    user.token = null;
                    return user.save();
                });
    },

    login: function(email, password) {
        return User
            .findOne({ email: email })
            .exec()
            .then(function(aUser){
                if(!aUser) {
                    throw({status: 422, message: "User doesn't exist"});
                }
                else {
                    if(aUser.comparePassword(password)){

                        aUser.setToken();
                        return aUser.save();
                    }
                    else {
                        throw({status: 401, message: "Incorrect credentials"});
                    }
                }
            });
    },

    tokenLogin: function(token) {
        console.log(token);
        return User
            .findOne({ token: token })
            .exec()
            .then(function(aUser){
                if(!aUser) {
                    throw({status: 401, message: "Cannot log in with incorrect token"});
                }
                if(aUser.isTokenExpired()) {
                    throw({status: 401, message: "Login token has expired"});
                }
                // new token with new expiry
                aUser.setToken();
                return aUser.save();
            });
    },

    create: function(email, password) {
        return User.findOne({ email: email })
                .select('id')
                .exec()
                .then(function(aUser){
                    if(aUser){
                        throw({status: 422, message: "User already exists"});
                    } else {

                        var passwordHash = crypto.createHash('sha256').update(password).digest('hex');

                        var newUser = new User({
                            email: email,
                            password: passwordHash,
                            avatar: {
                                url: null
                            }
                        });

                        newUser.setToken();

                        return newUser.save().then(function(createdUser){
                            // hide password
                            createdUser.password = null;
                            return createdUser;
                        });

                    }
                });
    },

    update: function(user) {
        return User
            .findOne({ _id: user._id })
            .exec()
            .then(function(aUser){
                if(aUser){
                    var query = { _id: user._id };
                    var updateFields = aUser.updateFields(user);
                    var options = {new: true};
                    return User.findOneAndUpdate(query, updateFields, options).exec();
                }
                else {
                    throw({status: 422, message: "User doesn't exist"});
                }
            });
    },

    updatePassword: function(user, currentPassword, newPassword) {
        return User
            .findOne({ _id: user._id })
            .exec()
            .then(function(aUser){
                if(aUser.comparePassword(currentPassword)){
                    aUser.password = crypto.createHash('sha256').update(newPassword).digest('hex');
                    return aUser.save();
                }
                else {
                    throw({status: 422, message: "Password is incorrect"});
                }
            });
    },


    updateSpotifyTokens: function(userId, accessToken, refreshToken) {
        return User
            .findOne({ _id: userId })
            .exec()
            .then(function(aUser){
                aUser.mediaSource.push({ accessToken : accessToken, refreshToken: refreshToken, source: 'spotify'});
                return aUser.save();
            });
    },

    resetPassword: function(token, email, newPassword) {
        return new Promise(function(resolve, reject) {
            User
                .findOne({email: email})
                .exec()
                .then(function (aUser) {
                    if(!aUser){
                        reject({status: 422, message: "The email you entered does not exist in the system"});
                    }
                    if (aUser.validateResetPasswordToken(token)) {
                        aUser.password = crypto.createHash('sha256').update(newPassword).digest('hex');
                        aUser.save();
                        resolve({message: "Your password has been reset"});
                    }
                    else {
                        reject({status: 422, message: "Reset token is invalid"});
                    }
                })
                .catch(function(error){
                    reject(error);
                });
        });
    },

    forgotPassword: function(enteredEmail) {
        return new Promise(function(resolve, reject){
            User
                .findOne({ email: enteredEmail })
                .exec()
                .then(function(aUser){
                    if(aUser){
                        var token = aUser.generateResetPasswordToken();
                        aUser.save();

                        //TODO: Send email, remove token from message below
                        resolve({message: "An email has been sent with a reset link to your email address."+token});

                    }
                    else {
                        reject({status: 422, message: "The email you entered does not exist in the system"});
                    }
                })
                .catch(function(error){
                    reject(error);
                });
        });
    },

    updateAvatar: function(req, res) {

        var fileName = null;
            var storage = multer.diskStorage({ //multers disk storage settings
                destination: function (req, file, cb) {
                    cb(null, config.imagePath);
                },
                filename: function (req, file, cb) {
                    fileName = req._user._id + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
                    cb(null, req._user._id + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
                }
            });

            var upload = multer({ //multer settings
                storage: storage
            }).single('avatar');

            return new Promise(function(resolve, reject)
            {
                upload(req, res, function (err) {
                    if (err) {
                        reject(err);
                    }

                    User
                        .findOne({_id: req._user._id})
                        .exec()
                        .then(function (aUser) {
                            if (aUser) {
                                aUser.avatar.url = config.host + ':' + config.port + config.imageWebPath + fileName;
                                var u = aUser.save();
                                resolve(u);
                            }
                            else {
                                reject("Can't find user");
                            }
                        });

                });
            });

    },

    addLeague: function(userId, leagueId) {
        return User
            .findOne({_id: userId})
            .exec()
            .then(function (aUser) {
                if (aUser) {
                    aUser.leagues.push({leagueId : leagueId});
                    return aUser.save();
                }
                else {
                    throw({status: 422, message: "User doesn't exist"});
                }
            });
    },

    removeLeague: function(leagueId) {
        return User
            .update(
            {'leagues.leagueId': {$eq: leagueId}},
            {$pull : { "leagues" : {"leagueId":leagueId} } },
            {multi: true}
            )
            .exec();
    }
};