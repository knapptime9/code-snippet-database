const express = require('express');
const session = require('express-session');
const logic = require('./logic.js');
const fs = require("fs");
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser');
const app = express();
const expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());


// const functionExample = function (req, res) {};

module.exports = {
  // Insert any exported functions here.
	// getRandomWord : getRandomWord,
	// checkGuess : checkGuess,
};
