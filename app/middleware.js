var bodyParser = require('body-parser');
var express = require('express');
var config = require('../config');
var userService = require('./services/user.js');
var path = require('path');

module.exports = function(app, apiRouter, openRouter){

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/api', apiRouter);
    app.use('/callback', openRouter);

    apiRouter.use('/api', function(req, res, next) {
        next();
    });

    apiRouter.use(function(req, res, next) {
        console.log(req.originalUrl);

        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");

        if ('OPTIONS' == req.method) {
            res.status(201).send();
        }
        else {
            next();
        }
    });

    // protect routes with token and pass user derived from token to next
    apiRouter.use(function(req, res, next) {

        var isOpenRoute = false;
        var openRoutes = config.openRoutes;
        for(var i=0; i<openRoutes.length; i++){
            if(req.originalUrl.substr(0,4) !== '/api' || (openRoutes[i].route === req.originalUrl && openRoutes[i].method === req.method)) {
                isOpenRoute = true;
                next();
            }
        }

        if(!isOpenRoute) {
            var token = req.get('X-Auth-Token');
            if (token) {
                userService
                    .getUserByToken(token)
                    .then(function (user) {
                        if (user) {
                            req._user = user;
                            next();
                        }
                        else {
                            res.status(422).send();
                        }
                    })
                    .catch(function () {
                        res.status(401).send();
                    });
            }
            else {
                res.status(401).send();
            }
        }
    });

    app.use(function(err, req, res, next) {
        console.log("ERR",err);
        res.status(err.status || 500).send(err);
    });

    return app;

}