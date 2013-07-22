var httpProxy = require('http-proxy'),
    http = http = require('http'),
    connect = require('connect');

//Create a proxy that combines the authorization server and
//resource server with this server so that we can make calls
//to both without cross domain issues
var options = {
    router: {
        //resource server endpoints to proxy to
        'localhost/api/protectedEndPoint': 'localhost:4000/api/protectedEndPoint',
        //authorization server endpoints to proxy to
        'localhost/oauth/token' : 'http://localhost:3000/oauth/token',
        'localhost/api/tokeninfo': 'http://localhost:3000/api/tokeninfo',

        //Serve our static content that is going to access the resource and authorization server
        'localhost/': 'localhost:6000'
    }
};

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(5000);

//Create a very simple static file server to serve up our static content
connect.createServer(
    connect.static('views')
).listen(6000);
