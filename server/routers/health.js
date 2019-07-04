var express = require('express');
var http = require('http');
//var chai = require('chai');

module.exports = function(app) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    res.json({status: 'UP'});
  });

  router.get('/test', async function (req, res, next) {
    // chai.request('http://localhost:32811')
    // .get('/')
    // .end(function(err, res) {
    //   console.log("hajhkaaj" + res.body);
    // });
    let options = {
      host: "127.0.0.1",
      port: 32844,
      path: '/grocerybackend/api/v1/item/bananas',
      method: 'DELETE',
      rejectUnauthorized: false,
      headers: {
        'Access-Control-Allow-Origin': "*",
        "Content-Type": "application/json"
      }
    }
    try{
      var req = http.request(options, function (res) {
        var responseString = "";
    
        res.on("data", function (data) {
            responseString += data;
            console.log(data)
            // save all the data from response
        });
        res.on("end", function () {
            res.send(responseString);
            console.log(responseString); 
            // print to console when response ends
        });
    });
    req.end();
    // console.log(retval.body);
    // res.json(retval.body);
    } catch (e) {
      console.log(e.toString());
    }
  });

  app.use("/health", router);
}


function asyncHttpRequest(options, body) {
  return new Promise(function (resolve, reject) {
    let req = http.request(options, function(res) {
      console.log("hello");
      res.body = '';
      res.on('error', function(err) {
        console.log(err);
        return reject(err);
      });
      res.on('data', function (data) {
        res.body += data
      });
      res.on('end', function() {
        return resolve(res);
      });
    }).on('error', function(err) {
      return reject(err);
    });
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

