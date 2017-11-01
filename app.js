// Declare inputs
var app = require('express')();
var redis = require('redis');
var bodyParser = require('body-parser');
var path = require('path');

// Create a new Redis client and connect to Redis Labs instance
var client = redis.createClient({
  host: 'redis-13348.c15.us-east-1-2.ec2.cloud.redislabs.com',
  port: '13348'
});

// If an error occurs, print it to the console
client.on('error', function (err) {
  console.log('Error: ' + err);
});

// Initial setup of game state
client.set('count', 0);

// Setup server to support JSON-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup server API
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/add', function (req, res) {
  // Get value from request body
  let value = parseInt(req.body.value || 0);

  // Get game state
  client.get('count', function (err, currentCount) {
    if (err) {
      throw(err);
    }

    // Add value to game state
    let updatedCount = parseInt(currentCount) + value;

    // Set updated game state
    client.set('count', updatedCount);

    // Get new game state
    client.get('count', function (err, newCount) {
      if (err) {
        throw(err);
      }

      // Return result
      res.send({count: newCount});
    });
  });
});

app.post('/sub', function (req, res) {
  // Get value from request body
  let value = parseInt(req.body.value || 0);

  // Get game state
  client.get('count', function (err, currentCount) {
    if (err) {
      throw(err);
    }

    // Subtract value from game state
    let updatedCount = parseInt(currentCount) - value;

    // Set updated game state
    client.set('count', updatedCount);

    // Get new game state
    client.get('count', function (err, newCount) {
      if (err) {
        throw(err);
      }

      // Return result
      res.send({count: newCount});
    });
  });
});

app.post('/clear', function (req, res) {
  // Reset game state
  client.set('count', 0);

  // Get new game state
  client.get('count', function (err, newCount) {
    if (err) {
      throw(err);
    }

    // Return result
    res.send({count: newCount});
  });
});

app.post('/show', function (req, res) {
  // Get game state
  client.get('count', function (err, count) {
    if (err) {
      throw(err);
    }

    // Return result
    res.send({count: count});
  });
});

// Set port
app.set('port', (process.env.PORT || 5000));

// Start server
app.listen(app.get('port'), function(){
  console.log('Server listening on port: ', app.get('port'));
});
