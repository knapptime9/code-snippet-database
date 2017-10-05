const express = require('express');
const session = require('express-session');
const flash = require('express-flash-messages')
const app = express();
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bluebird = require('bluebird');
mongoose.Promise = bluebird;
