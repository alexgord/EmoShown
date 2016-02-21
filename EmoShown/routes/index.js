var express = require('express');
var router = express.Router();
var sentiment = require('sentiment');
var request = require('request');
var striptags = require('striptags');
var afinn = require('../AFINN.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/test-input', function(req, res, next) {
  res.render('testinput', { title: 'Express' });
});

/* GET home page. */
router.get('/hello', function(req, res, next) {
  res.send('Hello world!');
});

router.post('/result', function(req, res)
{
    var text = req.body.sample;
    
    request({uri: text}, function(err, response, body)
    {
        var sent = sentiment(striptags(body));
        var picture = "";
        if(Math.abs(sent.comparative) < 0.01)
        {
            picture = "images/neutral.png"
        }
        else
        {
            if(sent.comparative > 0)
            {
                picture = "images/happy.png";
            }
            else
            {
                picture = "images/sad.png";
            }
        }
        
        var value = (sent.comparative + 5) * 10;
        
        res.render('result', { title: 'Happiness',
            picture:picture, value: value.toFixed(2)});
    });
});

router.post('/test-page', function(req, res) {
    var text = req.body.sample;
    //var link = sentiment(text);
    
    request({uri: text}, function(err, response, body)
    {
        var sent = sentiment(striptags(body));
        
        var str = JSON.stringify(sent);
        str += "<br>Sent score:<br>";
        str += JSON.stringify(sent.score);
        str += "<br>words length:<br>";
        str += JSON.stringify(sent.words.length);
        str += "<br>positive length:<br>";
        str += JSON.stringify(sent.positive.length);
        str += "<br>Negative length:<br>";
        str += JSON.stringify(sent.negative.length);
        str += "<br>aaa";
        res.send(str);
    });
});

module.exports = router;
