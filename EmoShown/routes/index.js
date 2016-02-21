var express = require('express');
var router = express.Router();
var sentiment = require('sentiment');
var request = require('request');
var striptags = require('striptags');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/hello', function(req, res, next) {
  res.send('Hello world!');
});

router.post('/test-page', function(req, res) {
    var text = req.body.sample;
    //var link = sentiment(text);
    
    request({uri: text}, function(err, response, body)
    {
        var sent = sentiment(striptags(body));
        res.send(JSON.stringify(sent));
    });
});

module.exports = router;
