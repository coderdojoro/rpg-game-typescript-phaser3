// @ts-check

var static = require('node-static');
const PORT = process.env.PORT || 8080

var fileServer = new static.Server('./dist');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        // console.log('serve: ' + request);
        fileServer.serve(request, response);
    }).resume();
}).listen(PORT);

