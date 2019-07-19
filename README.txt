Supported databases: Cassandra.  Coming soon: Mongoose, SQL, MySQL



Client use:
Drop the loggerClient.js into your workspace and initialise it like this:

const logger = require('./loggerClient.js').init("Test_App", "Instance_ID", 'localhost', 2222);

where "Test_App" is the name of your application,
and "Instance_ID" is the ID of that instance.  This is useful for if you are running multiple servers and need to know
which one caused an error.  If you will not be running multiple instances, it can be anything, otherwise we recommend
setting it in a config file and reading it from there.

Note: If you are running on default settings, then you wont need to supply 'localhost' as the IP and 2222 as the port.

Once the logger is initialised, you can send your logs to the central server.
These can be info, warnings, errors, critical, or major logs.

When you send a log, you have three fields: message, data, and use_stack_trace, however you do not need all of them

examples:

logger.info("User account created", {time: timestamp, id: account_id}, false);
//This will create an info log saying that a user account was created.  It will also have the data about the time and
//account id logged with it to make it easier to search logs.

logger.err("IndexOutOfBounds", {list: list_of_cars, index: i}, true);
//This will create an error log for an index error.  It will include the list it was searching, and the index it tried
//to access.  It will also include the stacktrace to where the log was created so you will be able to debug it easier.

logger.warn("Warning: LavaTheif added random warning logs");
//If you just want to log a message, then you can leave the data and use_stack_trace fields empty and they will default
//to {} and false respectively.  Additionally, you are able to leave use_stack_trace blank rather than writing false
//when you only want to log a message and some data