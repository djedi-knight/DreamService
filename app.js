var app = require('express')();
var redis = require('redis');
var path = require('path');

// create a new Redis client and connect to Redis Labs instance
var client = redis.createClient({
  host: 'redis-13348.c15.us-east-1-2.ec2.cloud.redislabs.com',
  port: '13348'
});

// if an error occurs, print it to the console
client.on('error', function (err) {
  console.log("Error " + err);
});

// setup server API
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

// set port
app.set('port', (process.env.PORT || 5000));

// start server
app.listen(app.get('port'), function(){
  console.log('Server listening on port: ', app.get('port'));
});
