var userService = require('../services/user');
var spotifyService = require('../services/spotify');
var config = require('../../config');

module.exports = {

    spotifyCallback: function(req, res, next) {

        // The authorization code returned from the initial request to the Account's /authorize endpoint
        var code = req.query.code;
        // The state of the app contains userId-redirectUrl
        var stateParts = req.query.state.split('-');
        var userId = stateParts[0];
        var redirectUrl = stateParts[1];

        spotifyService
            .getAccessToken(code)
            .then(function(spotifyData){

                // We now have access token and refresh token
                userService.updateSpotifyTokens(userId, spotifyData.access_token, spotifyData.refresh_token)
                    .then(function(user){
                        console.log(user);
                        // redirect back to original page that flow started
                        res.redirect(redirectUrl);
                    });
            })
            .catch(function(error) {
                return next(error);
            });
    },

    login: function(req, res, next){
        var clientId = config.spotify.client_id;
        var responseType = config.spotify.response_type;
        var redirectUri = config.spotify.redirect_uri;
        var state = req._user._id +'-'+ encodeURI(req.header('Referer'));
        var spotifyAuthUri = 'https://accounts.spotify.com/authorize/?client_id='+clientId+'&response_type='+responseType+'&redirect_uri='+redirectUri+'&state='+state+'&show_dialog=false';
        res.json({spotifyAuthUri: spotifyAuthUri});
    }
}