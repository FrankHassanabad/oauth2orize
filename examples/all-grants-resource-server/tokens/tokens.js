// The access token and optionally refresh token.
//    You will use these to access your end point data through the means outlined
//    in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//    (http://tools.ietf.org/html/rfc6750)

var tokens = { };

exports.find = function(accessToken, done) {
    var token = tokens[accessToken];
    return done(null, token);
};

exports.save = function(accessToken, refreshToken, clientID, scope, done) {
    tokens[accessToken] = { accessToken: accessToken, refreshToken: refreshToken, clientID: clientID, scope: scope};
    return done(null);
};

//TODO Do we still need this?  I'm not using it anywhere
exports.findByClientID = function(clientID, done) {
    var keys = Object.keys(tokens);
    for (var i = 0, len = keys.length; i < len; i++) {
        var token = tokens[keys[i]];
        if (token.clientID === clientID) {
            return done(null, token);
        }
    }
    return done(null, null);
};

