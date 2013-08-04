/**
 * The client id and the client secret
 * @type {{clientID: string, clientSecret: string}}
 */
exports.client = {
    clientID: "abc123",
    clientSecret: "ssh-secret"
};

/**
 * The Authorization server's location, port number, and the token info end point
 * @type {{host: string, port: string, url: string, tokenURL: string, tokeninfoURL: string}}
 */
exports.authorization = {
    host: "localhost",
    port: "3000",
    url: "https://localhost:3000/",
    tokenURL: "oauth/token",
    tokeninfoURL: "/api/tokeninfo?access_token="
};

