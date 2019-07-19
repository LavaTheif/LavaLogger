const cassandra = require('cassandra-driver');
/*

 */
exports.save = async function(json, config){
    let level = json.level;//int (PK)
    let message = json.message+"";//String
    let data = JSON.stringify(json.data);//String
    let callback = json.callback;
    let app = callback.app+"";//String
    let id = callback.id+"";//String
    let trace = callback.trace+"";//String
    if(!trace) trace = "";

    var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;
    var client = new cassandra.Client({ contactPoints:[config.ip+':'+config.port], localDataCenter: 'datacenter1',
        authProvider: new PlainTextAuthProvider('cassandra', 'cassandra')});

    let query = `INSERT INTO ${config.schema}.logs(timestamp, level, message, data, app, id, trace) VALUES(?, ?, ?, ?, ?, ?, ?);`;
    await client.execute(query, [new Date().getTime(), level, message, data, app, id, trace], { prepare : true }).catch(e=>console.log(e));
    client.shutdown();
}

exports.create = function(config){
    let keyspace = `CREATE KEYSPACE IF NOT EXISTS ${config.schema}
    WITH REPLICATION = {
        'class' : 'SimpleStrategy',
        'replication_factor' : 1
    };`

    let table = `CREATE TABLE IF NOT EXISTS ${config.schema}.logs(timestamp BIGINT, level INT, message VARCHAR, data VARCHAR, app VARCHAR, id VARCHAR, trace VARCHAR, PRIMARY KEY ((level), app, id, timestamp));`;

    //TODO: execute
}