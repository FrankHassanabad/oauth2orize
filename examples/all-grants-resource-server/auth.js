var passport = require('passport')
    , https = require('https')
    , http = require('http')
    , LocalStrategy = require('passport-local').Strategy
    , OAuth2 = require('oauth').OAuth2
    , tokens = require('./tokens').tokens
    , client = require('./config').client
    , BearerStrategy = require('passport-http-bearer').Strategy
    , authorization = require('./config').authorization;


/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.  The login
 * mechanism is going to use our server's client id/secret to authenticate/authorize
 * the user and get both an access and refresh token.  The sever *does not* store the
 * user's name and the server *does not* store the user's password.  Instead, using
 * the access token the server can reach endpoints that the user has been granted
 * access to.
 *
 * A cookie/session which *does not* have the access token is pushed through passport
 * onto the local user's system.  That web cookie/session enables us to not have to
 * repeatedly call the authentication/authorization sever continuously for simple static
 * HTML page loading.  However, end points that are protected still will need the access
 * token passed to them through the Authorization Bearer usage.
 */
passport.use(new LocalStrategy(
    function(username, password, done) {
        var oauth2 = new OAuth2(client.clientID,client.clientSecret,authorization.url,null,authorization.tokenURL,null);
        oauth2.getOAuthAccessToken('',{'grant_type':'password', 'username': username, 'password': password, 'scope': 'offline_access'},
            function (e, access_token, refresh_token, results) {
                if(access_token) {
                    //TODO scopes
                    tokens.save(access_token, refresh_token, client.clientID, null, function(err) {
                        if(err) { return done(null, false); }
                        return done(null, {accessToken: access_token, refreshToken: refresh_token});
                    });
                } else {
                    return done(null, false);
                }
            }
        );
    }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
    function(accessToken, done) {
        tokens.find(accessToken, function(err, token) {
           if (err) {return done(err); }
            if(!token) {
                //TODO Dynamically set the http or https just like it does
                //within the ouath side.  Use the configured authorization information
                //and then figure out if you need http or https.  From there call this
                //to get te data and return correctly
                //TODO Set the endpoint information to be part of config
                var optionsget = {
                    host : 'localhost',
                    port : 3000,
                    path : '/api/tokeninfo?access_token=' + accessToken,
                    method : 'GET'
                };
                var reqGet = http.request(optionsget, function(res) {
                    if(res.statusCode === 200) {
                        res.on('data', function(data) {
                            var jsonReturn = JSON.parse(data);
                            if(jsonReturn.error) {
                                return done(null, false);
                            } else {
                                //TODO scopes
                                tokens.save(accessToken, null, client.clientID, null, function(err) {
                                    return done(null, accessToken);
                                });
                            }
                        });
                    } else {
                        return done(null, false);
                    }
                });
                reqGet.end();
            } else {
                return done(null, token);
            }
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

