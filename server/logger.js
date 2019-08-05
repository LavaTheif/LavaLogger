let levels = {0:'info', 1:'warn', 2:'error', 3:'critical', 4:'major', 5:'internal'};//This is in multiple files

let config;
let last_query = 0;


exports.log = function(json, c){
    if(!config){
        if(!c) {
            const fs = require('fs');
            let rawdata = fs.readFileSync('./config.json');
            config = JSON.parse(rawdata);
        }else{
            config = c;
        }
    }
    let delay = 100;
    if(last_query+delay > new Date().getTime()){
        setTimeout(function(){
            exports.log(json, c)
        }, last_query+delay - new Date().getTime());
        return;
    }
    last_query = new Date().getTime();

    let db_type = config.db_type;

    if(typeof json !== typeof {}){//cant remember if it's Object or object
        json = JSON.parse(json);
    }

    let callback = json.callback;
    if(!callback){
        callback = {app: "unknown", id: "unknown"};
        internal_log("Logger called with no app or id set.", null, null);
    }
    if(!callback.app){
        callback['app'] = "unknown";
        internal_log("Logger called with no app set.", null, null);
    }
    if(!callback.id){
        callback['id'] = "unknown";
        internal_log("Logger called with no id set.", null, null);
    }
    json.callback = callback;

    // console.log(db_type)
    require(`./database/${db_type}.js`).save(json, config);
}

function internal_log(message, data, includeStack) {
    try{
        //TODO: optimise so I am not throwing errors
        throw new Error();
    }catch(e){
        let stack = e.stack.split("\n");
        delete stack[0];
        delete stack[1];
        if(!includeStack){
            stack = null;
        }else{
            stack = stack.join("\n");
        }

        exports.log({level: 5, message:message, data: data, callback: {app: "logger_internal", "id":"logger_internal", trace:stack}});
    }
}
