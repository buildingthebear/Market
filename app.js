require("dotenv").config();

const bodyParser = require("body-parser");
const express = require('express');
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/site', express.static(path.join(__dirname, 'site')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', function (req, res) {
    res.sendFile('views/index.html', { root: '.' });
});

app.get('/docs', function (req, res) {
    res.sendFile('site/index.html', { root: '.' });
});

let server = app.listen(5000, function () {
    console.log('up and running..');
});