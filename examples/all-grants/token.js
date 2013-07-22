/**
 * Module dependencies.
 */
var passport = require('passport')
    , db = require('./db');

//TODO Document this, what it expects and what it returns from
//the google documentation
//https://developers.google.com/accounts/docs/OAuth2UserAgent#validatetoken

//TODO Test this without giving a parameter value...It seems to hang

exports.info = [
    function(req, res) {
        if(req.query.access_token) {
            db.accessTokens.find(req.query.access_token, function (err, token) {
                if(err || !token) {
                    res.status(400);
                    res.json({ error: "invalid_token" });
                } else {
                    db.clients.find(token.clientID, function (err, client) {
                       if(err || !client) {
                           res.status(400);
                           res.json({ error: "invalid_token"})
                       } else {
                           res.json({audience: client.clientId })
                       }
                    });
                }
            });
        }
    }
];
