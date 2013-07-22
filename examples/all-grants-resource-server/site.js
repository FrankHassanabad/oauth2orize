var passport = require('passport')
    , login = require('connect-ensure-login')
    , tokens = require('./tokens').tokens
    , client = require('./config').client;


exports.index = function(req, res) {
    res.send('OAuth 2.0 Resource Server');
};

exports.loginForm = function(req, res) {
    res.render('login');
};

exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

exports.info = [
    login.ensureLoggedIn(),
    function(req, res) {
        var accessToken = req.user.accessToken;
        var refreshToken = req.user.refreshToken;
        res.render('info', {
            access_token: accessToken,
            refresh_token: refreshToken
        });
    }
];

/**
 * Example Protected EndPoint
 *
 * This endpoint is protected to where you have to send the Authorization Bearer
 * token to it and that token has to be valid on the authorization server
 */
exports.protectedEndPoint = [
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        //You can send whatever you want, such as JSON, etc...
        //For a illustrative example, I'm just sending a string back
        res.send('Successful Protected EndPoint Data Call');
    }
];
