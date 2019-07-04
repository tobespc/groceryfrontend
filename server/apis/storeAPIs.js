var express = require('express');
var http = require('http');

module.exports = function(app) {
  var router = express.Router();
  var backendHost = "cw-nodebackend-e4d739a0-9732-11e9-9b1f-2bb77e312d8f";
  var backendPort = 9096;

  app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    return next();
  });      


  router.get('/api/v1/items', async function (req, res, next) {
      
      const options = {
            hostname: backendHost,
            port: backendPort,
            path: "/api/v1/items",
            method: "GET",
            timeout: 1000
        };
        
        var retVal = await asyncHttpRequest(options, undefined);
        //console.log("All items: " + retVal.body);
 
    res.json(JSON.parse(retVal.body));
  });



  /* ADD DELETE ITEM FEATURE HERE - DELETE BACKEND FUNCTION */

  router.put('/api/v1/items/:id/:quantity/:price', async function (req, res, next) {
      
    const options = {
            hostname: backendHost,
            port: backendPort,
            path: encodeURI("/api/v1/items/" + req.params.id + "/" + req.params.quantity + "/" + req.params.price),
            method: "PUT",
            timeout: 1000
        };
        
        var retVal = await asyncHttpRequest(options, undefined);
 
        res.status(200).send(retVal.body);

  });

  router.post('/api/v1/price/:id/:price/', async function (req, res, next) {
        const options = {
            hostname: backendHost,
            port: backendPort,
            path: encodeURI("/api/v1/price/" + req.params.id + "/" + req.params.price),
            method: "POST",
            timeout: 1000
        };
        
        var retVal = await asyncHttpRequest(options, undefined);
 
        res.status(200).send(retVal.body);
  });


  router.post('/api/v1/quantity/:id/:quantity/', async function (req, res, next) {
        const options = {
            hostname: backendHost,
            port: backendPort,
            path: encodeURI("/api/v1/quantity/" + req.params.id + "/" + req.params.quantity),
            method: "POST",
            timeout: 1000
        };
        
        var retVal = await asyncHttpRequest(options, undefined);
 
        res.status(200).send(retVal.body);
  });
    
  router.delete('/api/v1/item/:id', async function (req, res, next) {
        const options = {
            hostname: backendHost,
            port: backendPort,
            path: encodeURI("/api/v1/item/" + req.params.id),
            method: "DELETE",
            timeout: 1000
        };
        
        var retVal = await asyncHttpRequest(options, undefined);
 
        res.status(200).send(retVal.body);
  });


    
  function asyncHttpRequest(options, body) {
  return new Promise(function (resolve, reject) {
    let req = http.request(options, function(res) {
      res.body = '';
      res.on('error', function(err) {
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

  app.use("/store", router);
}



