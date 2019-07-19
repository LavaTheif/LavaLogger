//Entry point for the logger server

//Starts up the socket server
let net = require('net');
let server = net.createServer();
let logger = require("./logger");

const fs = require('fs');
let config = JSON.parse(fs.readFileSync('./config.json'));

server.on('connection',function(socket){
    socket.setEncoding('utf8');

    socket.setTimeout(100);

    socket.on('data',function(data){
        logger.log(data, config);
    });

    socket.on('error',function(error){
        console.log('Error : ' + error);
    });

    socket.on('close',function(error){});

    setTimeout(function(){
        socket.destroy();
    },100);

});

server.on('error',function(error){
    console.log('Error: ' + error);
});

server.on('listening',function(){
    console.log('Server is listening!');
});

server.maxConnections = 15;
server.listen(config.server_port);
