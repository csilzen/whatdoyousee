var express = require('express');
var app = express();

var router = require('express').Router();
var port = 8080;

app.use(express.static(__dirname + '/client')); // serves up index.html

console.log(__dirname);

console.log('listening on port', port);
app.listen(port);

module.exports = app;