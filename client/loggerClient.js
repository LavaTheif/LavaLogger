let name, id, _ip='localhost', _port=2222;
// let callback = {};

let last = 0;
let delay = 100;

exports.init = function(app_name, instance_id, ip, port){
    name = app_name;
    id = instance_id;

    // callback['app'] = app_name;
    // callback['id'] = instance_id;

    if(ip)
        _ip=ip;

    if(port)
        _port = port;

    return this;
}

log = function(level, message, data, callback) {
    if(last+delay > new Date().getTime()){
        setTimeout(function(){
            log(level, message, data, callback)
        }, last+delay - new Date().getTime());
        return;
    }
    last = new Date().getTime();

    if(!data){
        data = {}
    }
    let json = {
        level: level,
        message: message,
        data: data,
        callback: callback
    };

    if(_port === -1){
        require('../server/logger.js').log(json);
        return;
    }

    let net = require('net');
    let client = new net.Socket();

    client.connect({
        ip: _ip,
        port: _port
    });

    client.on('connect', function () {
        client.write(JSON.stringify(json));
    });

    client.setEncoding('utf8');

    client.on('data', function (data) {});

    setTimeout(function () {
        client.destroy();
    }, 100);
};

//{app: "testapp", "id": "inst_1", trace: null}

getStack = function(){
    try{
        //TODO: optimise so I am not throwing errors
        throw new Error();
    }catch(e) {
        let stack = e.stack.split("\n");
        delete stack[0];
        delete stack[1];
        delete stack[2];
        return stack.join("\n");
    }
}

exports.info = function(message, data, use_stack_trace){
    let c = {app: name, id: id};
    if(use_stack_trace){
        c['trace'] = getStack();
    }
    log(0, message, data, c);
}

exports.warn = function(message, data, use_stack_trace){
    let c = {app: name, id: id};
    if(use_stack_trace){
        c['trace'] = getStack();
    }
    log(1, message, data, c);
}

exports.err = function(message, data, use_stack_trace){
    let c = {app: name, id: id};
    if(use_stack_trace){
        c['trace'] = getStack();
    }
    log(2, message, data, c);
}

exports.critical = function(message, data, use_stack_trace){
    let c = {app: name, id: id};
    if(use_stack_trace){
        c['trace'] = getStack();
    }
    log(3, message, data, c);
}

exports.major = function(message, data, use_stack_trace){
    let c = {app: name, id: id};
    if(use_stack_trace){
        c['trace'] = getStack();
    }
    log(4, message, data, c);
};