var path = require('path');
var express = require('express');
var app = express();
var router = express.Router();

// react
// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config');

var PORT = 4000;

// SQLITE3
var sqlite = require('sqlite3').verbose();
var table = new sqlite.Database('./clues.db');

function getAllWords(cb) {
    table.all("SELECT * FROM working_table WHERE id < 20000", function(err, words) {
        if(!err) {
            console.log('words.length',words.length);
            cb(words);
        } else {
            cb(words);
        }
    });
}

function getWordsSubset(words, count, cb) {
    var numbers = []
    if (words.length < count) {
        return cb(null);
    }
    while(numbers.length < count){
        var randomNumber=Math.ceil(Math.random()*words.length)
        var found=false;
        for(var i=0;i<numbers.length;i++) {
            if (numbers[i]==randomNumber){found=true;break}
        }
        if (!found) {
            numbers[numbers.length]=randomNumber;
        }
    }
    var subset = [];
    numbers.forEach(num => {
        subset.push(words[num])
    })
    return cb(subset);
}

// load words from DB to start game
getAllWords((words) => {
    router.route('/all').get(function(req, res) {
        return res.json(words);
    });

    router.route('/game').get(function(req, res) {
        getWordsSubset(words, 20, (subset) => {
            return res.json(subset);
        });
    });
})

app.use('/api/', router)
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    console.log(`serving public on ${PORT}`);
});
