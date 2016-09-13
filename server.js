const path = require('path');
const express = require('express');
const app = express();
// const sqlite = require('sqlite3').verbose();
// const table = new sqlite.Database('./clues.db');

const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, function() {
 	console.log(`serving ./public on ${PORT}`);
});
