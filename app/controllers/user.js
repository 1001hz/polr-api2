var userService = require('../services/user');

module.exports = {

    findById: function(req, res){
        res.json({"id": req._user});
    },

    create: function(req, res, next) {
        userService
            .create(req.body.email, req.body.password)
            .then(function(user){
                res.json(user);
            })
            .catch(function(error) {
                return next(error);
            });
    },

    update: function(req, res, next){
        userService
            .update(req.body)
            .then(function(user){
                res.json(user);
            })
            .catch(function(error) {
                return next(error);
            });
    },

    updatePassword: function(req, res, next){
        userService
            .updatePassword(req._user, req.body.current, req.body.new)
            .then(function(){
                res.status(200).send({});
            })
            .catch(function(error) {
                return next(error);
            });
    },

    updateAvatar: function(req, res, next){
        userService
            .updateAvatar(req, res)
            .then(function(user){
                res.json(user);
            })
            .catch(function(error) {
                return next(error);
            });
    }

}