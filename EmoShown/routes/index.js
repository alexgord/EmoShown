var express = require('express');
var router = express.Router();
var sentiment = require('sentiment');
var request = require('request');
var striptags = require('striptags');
var lib = require('../lib.js');
var afinn = require("../AFINN.json");
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'EmoShown' });
});

/* GET home page. */
router.get('/test-input', function(req, res, next) {
  res.render('testinput', { title: 'Express' });
});

/* GET home page. */
router.get('/hello', function(req, res, next) {
  res.send('Hello world!');
});

router.post('/graph', function(req, res)
{
    var text = req.body.url;
    var wordinfo = [];
    
    if(text.indexOf("http://") != 0 && text.indexOf("https://") != 0 
        && text.indexOf("http//") != 0 && text.indexOf("https//") != 0)
    {
        text = "http://" + text;
    }
    
    var uri = url.format(url.parse(text));
    
    console.log("---------------------------");
    
    console.log(uri);
    
    request({uri: uri}, function(err, response, body)
    {
        var sent = sentiment(body.replace(/(<([^>]+)>)/ig," ").replace(/\s+/g, ' '));//striptags(body));
        //sent.words
        for(var i = 0; i < sent.words.length; ++i)
        {
            var c = wordinfo.filter(function (el) {
            return el.word == sent.words[i];
            }).length;
            if(c == 0)
            {
                var item = afinn[sent.words[i]];
                if (typeof item === 'undefined')
                {
                    continue;
                }
                wordinfo.push({word: sent.words[i] , count: 1, value : item});
            }
            else
            {
                for(var j = 0; j < wordinfo.length; ++j)
                {
                    if(wordinfo[j].word == sent.words[j])
                    {
                        wordinfo[j].count = wordinfo[j].count + 1;
                    }
                }
            }
        }
        
        var arr = [
                    ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
                    ['Words',    null,                 0,                               0],
                    //['America',   'Words',             11,                               10],
                    //['Europe',    'Words',             42,                               -11],
                    //['Asia',      'Words',             36,                               4],
                    //['Australia', 'Words',             0,                               0],
                    //['Africa',    'Words',             210,                               0]
                ];
                
        for(var k = 0; k < wordinfo.length; ++k)
        {
            arr.push([wordinfo[k].word, 'Words', wordinfo[k].count, wordinfo[k].value ]);
        }
        
        res.render('graph', {title: "Graph" , arr: JSON.stringify(arr)});
    });
});

router.post('/result', function(req, res)
{
    var text = req.body.sample;
    
    var positiveResponses = ["This page makes duck happy!",
        "Better than bread!", "Good read!", "Quacking good!"];
        
    var negativeResponses = ["This page made duck sad", "I'd rather have bread", "A bunch of quack", "This webpage made me want to duck away"];
    
    var neutralResponses = ["Duck doesn't know what to think of this webpage", "I am a duck, I cannot read", "Quack", "Mostly harmless to ducks"];
    
    var response = "";
    
    if(text.indexOf("http://") != 0 && text.indexOf("https://") != 0 
        && text.indexOf("http//") != 0 && text.indexOf("https//") != 0)
    {
        text = "http://" + text;
    }
    
    var uri = url.format(url.parse(text));
    
    console.log("---------------------------");
    
    console.log(uri);
    
    request({uri: uri}, function(err, response, body)
    {
        var sent = sentiment(body.replace(/(<([^>]+)>)/ig," ").replace(/\s+/g, ' '));
        var picture = "";
        if(Math.abs(sent.score) < 10)
        {
            picture = "images/neutral.png";
            response = neutralResponses[lib.getRandomInt(0, neutralResponses.length - 1)];
        }
        else
        {
            if(sent.score > 0)
            {
                picture = "images/happy.png";
                response = positiveResponses[lib.getRandomInt(0, positiveResponses.length - 1)];
            }
            else
            {
                picture = "images/sad.png";
                response = negativeResponses[lib.getRandomInt(0, negativeResponses.length - 1)];
            }
        }
        
        console.log(JSON.stringify(sent));
        
        var value = sent.score;//(sent.comparative + 5.0) * 10.0;
        var average = ((sent.comparative + 5.0) * 10.0).toFixed(2);
        
        res.render('result', { title: 'Score',
            picture:picture, value: value,
            average: average,
            responsetext: response,
            url: uri});
    });
});

router.post('/test-page', function(req, res) {
    var text = req.body.sample;
    //var link = sentiment(text);
    
    request({uri: text}, function(err, response, body)
    {
        var sent = sentiment(body.replace(/(<([^>]+)>)/ig," ").replace(/\s+/g, ' '));
        
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
