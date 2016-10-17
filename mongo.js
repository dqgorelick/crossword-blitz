const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PORT = 4000;
const url = 'mongodb://localhost:27017/crossword_blitz';

const crosswordSchema = mongoose.Schema({
    id: Number,
    clue: String,
    word: String,
    length: Number,
    year: Number,
    month: Number,
    occurences: Number,
    attempts: Number,
    correct: Number,
    flagged: Number
});
var Crossword = mongoose.model('Crossword', crosswordSchema);

// SQLITE3
const sqlite = require('sqlite3').verbose();
const table = new sqlite.Database('./clues.db');

// MONGO
mongoose.connect(url);

function getAllWordsFromSqlite(cb) {
    table.all("SELECT * FROM working_table WHERE id < 200", function(err, row) {
        if(!err) {
            console.log('row.length',row.length);
            cb(row);
        } else {
            console.log('err',err);
        }
    });
}

function clearMongoDB() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        Crossword.remove({}, (err, removed) => {
            if (err) console.log('err',err);
            console.log('removed',removed);
            console.log(`Removed ${removed.length} many items`);
            db.close();
        })
    });
}

function migrateSqliteToMongoDB() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        getAllWordsFromSqlite((words) =>  {
            Crossword.find({}, (err, pairs) => {
                if (err) return console.error(err);
                const documents = [];
                words.forEach((word, iter)=> {
                    // const filtered = pairs.filter(pair => pair.id === word.id);
                    // if (filtered.length) {
                        // console.log('iter',iter);
                        // console.log(`ALREADY EXISTS ${word.word}`);
                    // } else {
                        const clueRow = new Crossword({
                            id: word.id,
                            clue: word.clue,
                            word: word.word,
                            length: word['length'],
                            year: word.year,
                            month: word.month,
                            occurences: word.occurences,
                            attempts: word.attempts,
                            correct: word.correct,
                            flagged: word.flagged
                        });
                        documents.push(clueRow);
                        console.log('documents.length',documents.length);
                        // clueRow.save((err, clueRow) => {
                        //     if (err) {
                        //         return console.error(err);
                        //     } else {
                        //         console.log('iter',iter);
                        //         console.log(`Saved ${clueRow.word}`);
                        //     }
                        // });
                    // }
                });
                Crossword.collection.insert(documents, {}, function(err, result) {
                    if (err) {return console.log('err',err);}
                    console.log('result',result);
                });

            })
        });
    });
}

function readFromMongoDB() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        Crossword.find({}, (err, words) => {
            console.log('words.length',words.length);
            db.close();
        });
    });
}

// readFromMongoDB();
migrateSqliteToMongoDB();
// clearMongoDB();


// app.use(express.static(path.join(__dirname, 'public')));
// app.listen(PORT, () => {
//     console.log(`serving ./public on ${PORT}`);
// });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('working!');
// });
