var express = require('express');
var router = express.Router();
var sentiment = require('sentiment');
var request = require('request');
var striptags = require('striptags');
var lib = require('../lib.js');

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
    
    var positiveResponses = ["This page makes duck happy!",
        "Better than bread!", "Good read!", "Quacking good!"];
        
    var negativeResponses = ["This page made duck sad", "I'd rather have bread", "A bunch of quack", "This webpage made me want to duck away"];
    
    var neutralResponses = ["Duck doesn't know what to think of this webpage", "I am a duck, I cannot read", "Quack", "Mostly harmless to ducks"];
    
    var response = "";
    
    request({uri: text}, function(err, response, body)
    {
        var sent = sentiment(striptags(body));
        var picture = "";
        if(Math.abs(sent.comparative) < 0.01)
        {
            picture = "images/neutral.png";
            response = neutralResponses[lib.getRandomInt(0, neutralResponses.length)];
        }
        else
        {
            if(sent.comparative > 0)
            {
                picture = "images/happy.png";
                response = positiveResponses[lib.getRandomInt(0, positiveResponses.length)];
            }
            else
            {
                picture = "images/sad.png";
                response = negativeResponses[lib.getRandomInt(0, negativeResponses.length)];
            }
        }
        
        var value = (sent.comparative + 5) * 10;
        
        res.render('result', { title: 'Score',
            picture:picture, value: value.toFixed(2),
            responsetext: response});
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
