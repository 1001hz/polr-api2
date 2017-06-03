var api = require('./controllers/api');
var user = require('./controllers/user');
var auth = require('./controllers/auth');
var league = require('./controllers/league');

module.exports = function(router){

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
        .route('/api/login')
        .post(auth.login);

    router
        .route('/api/user/logout')
        .get(auth.logout);

    router
        .route('/api/token-login')
        .post(auth.tokenLogin);

    router
        .route('/api/forgot-password')
        .post(auth.forgotPassword);

    router
        .route('/api/reset-password')
        .post(auth.resetPassword);

    /**
     * User Section
     */

    router
        .route('/api/user/:id')
        .get(user.findById);

    router
        .route('/api/open/user')
        .post(user.create);

    router
        .route('/api/user')
        .post(user.update);

    router
        .route('/api/user/password')
        .post(user.updatePassword);

    router
        .route('/api/user/avatar')
        .post(user.updateAvatar);

    /**
     * League Section
     */

    router
        .route('/api/league/:id')
        .get(league.findById);

    router
        .route('/api/league')
        .post(league.create);

    router
        .route('/api/leagues')
        .get(league.fetch);

    router
        .route('/api/league')
        .put(league.modify);

    router
        .route('/api/league/join')
        .post(league.joinLeague);

}