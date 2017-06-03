var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../../config');

var AvatarSchema = new Schema({
    source: { type: String, default: 'app' },
    url: { type: String }
});

var LeagueSchema = new Schema({
    leagueId: { type: String }
});

var UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    token: { type: String },
    lastLogin: { type: String },
    fname: { type: String },
    lname: { type: String },
    avatar: AvatarSchema,
    leagues: [LeagueSchema]
});

UserSchema.methods.updateFields = function (clientUser) {
    return {
        fname: clientUser.fname ? clientUser.fname : this.fname,
        lname: clientUser.lname ? clientUser.lname : this.lname
    };
};

UserSchema.methods.setToken = function () {

    //Set token
    var d = new Date();
    var now = d.getTime();
    this.token = crypto.createHash('sha256').update(this.email + config.secret + now).digest('hex');
    this.lastLogin = now;
};

UserSchema.methods.comparePassword = function (candidatePassword) {

    var candidatePasswordHash = crypto.createHash('sha256').update(candidatePassword).digest('hex');
    return candidatePasswordHash == this.password;
};

UserSchema.methods.generateResetPasswordToken = function () {

    return crypto.createHash('sha256').update(this.email + config.secret + this.lastLogin).digest('hex');
};

UserSchema.methods.validateResetPasswordToken = function (token) {

    return token === crypto.createHash('sha256').update(this.email + config.secret + this.lastLogin).digest('hex');
};

UserSchema.methods.isTokenExpired = function () {
    var d = new Date();
    var now = d.getTime();
    return (now - this.lastLogin) > config.tokenExpiryInMs
};


module.exports = mongoose.model('User', UserSchema);