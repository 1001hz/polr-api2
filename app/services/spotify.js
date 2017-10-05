
var User = require('../models/user');
var config = require('../../config');
var querystring = require('querystring');
const axios = require('axios');


module.exports = {

    getAccessToken: function(code) {

        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        return axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: config.spotify.grant_type,
            code: code,
            redirect_uri: config.spotify.redirect_uri,
            client_id: config.spotify.client_id,
            client_secret: config.spotify.client_secret
        }))
            .then(function(response) {
                return response.data;
            })
            .catch(function(error) {
                throw({status: 500, message: "Cannot connect to Spotify"});
            });
    }
};