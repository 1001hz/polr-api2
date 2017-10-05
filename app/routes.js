var api = require('./controllers/api');
var user = require('./controllers/user');
var auth = require('./controllers/auth');
var league = require('./controllers/league');
var spotify = require('./controllers/spotify');

module.exports = function(router, openRouter){

    /**
     * Open Callbacks
     */
    openRouter
        .route('/spotify')
        .get(spotify.spotifyCallback);

    /**
     * Boilerplate
     */
    router
        .route('/')
        .get(api.getMessage);

    router
        .route('/error')
        .get(api.getError);

    router
        .route('/api')
        .get(api.getMessage);

    /**
     * Auth Section
     */
    router
        .route('/login')
        .post(auth.login);

    router
        .route('/login/token')
        .post(auth.tokenLogin);

    router
        .route('/logout')
        .get(auth.logout);

    router
        .route('/password/forgot')
        .post(auth.forgotPassword);

    router
        .route('/password/reset')
        .post(auth.resetPassword);

    router
        .route('/spotify/login')
        .get(spotify.login);

    /**
     * User Section
     */

    router
        .route('/user/:id')
        .get(user.findById);

    router
        .route('/user')
        .post(user.create);

    router
        .route('/user')
        .patch(user.update);

    router
        .route('/user/password')
        .put(user.updatePassword);

    router
        .route('/user/avatar')
        .post(user.updateAvatar);

    /**
     * League Section
     */

    router
        .route('/league/:id')
        .get(league.findById);

    router
        .route('/league')
        .post(league.create);

    router
        .route('/leagues')
        .get(league.fetch);

    router
        .route('/league')
        .put(league.modify);

    router
        .route('/league/join')
        .post(league.joinLeague);

    router
        .route('/league/:id')
        .delete(league.delete);

}