exports.init = function(app_name, instance_id){
    return require('../client/loggerClient.js').init(app_name, instance_id, '', -1);
};
