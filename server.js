var express = require('express');
var config = require('./config');
var mongoose = require('mongoose');

var port = process.env.PORT||config.port;
var app = express();
var router = express.Router();

app = require('./app/middleware')(app, router);
require('./app/routes')(router);


/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

// Use native promises
mongoose.Promise = global.Promise;

mongoose.connect(config.database, options);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

mongoose.connection.once('open', function() {
    console.log('Mongoose connection open');
    app.listen(port,function(){
        console.log('Running on port '+port);
    })
});
