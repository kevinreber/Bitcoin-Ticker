//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');

//Requires request package
var request = require('request');

const app = express();

//Allows server to access images files and css by specifying folder
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(re, res) {
  res.sendFile(__dirname + '/index.html');
});

//When button is pressed, crypto that is selected will be returned
//Data can be used to send to Crypto Server to get relevant price action
app.post('/', function(req, res) {
  // console.log(req.body.crypto);

  //variables will store user chosen dropdown menu
  var crypto = req.body.crypto;
  var fiat = req.body.fiat;
  var amount = req.body.amount;

  var options = {
    //keys are predefined from npmjs **DON'T CHANGE**
    //base URL for price conversion
    url: 'https://apiv2.bitcoinaverage.com/convert/global',
    //http method (default: 'GET')
    method: "GET",
    //Object containing querystring values to be appened to url
    qs: {
      //parameters (reference Price Conversion API)
      from: crypto,
      to: fiat,
      amount: amount
    }
  };

  request(options, function(error, response, body) {

    //statusCode returns 200 which means request to server was success
    //console.log(response.statusCode);

    //reponse.body returns data that was requested (regarding USD & BTC)
    // console.log(response.body);

    //JSON.parse turns string into object
    var data = JSON.parse(body);
    var price = data.price;
    var currentDate = data.time;

    console.log(price);
    res.write('<p>The current date is ' + currentDate + '</p>');

    res.write('<h1>' + amount + crypto + ' is ' + price + fiat + '</h1>');

    res.send();
  });

});

app.listen(3000, function() {
  console.log('Server is running on port 3000.');
});
