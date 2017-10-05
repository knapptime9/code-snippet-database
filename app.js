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

const codeSnippet = require("./models/codeSnippet");
const User = require("./models/user");


const accountRoute = require("./routes/account");
const codeRoute = require("./routes/code");
const searchRoute = require("./routes/search");

app.use("/", accountRoute);
app.use("/", codeRoute);
app.use("/", searchRoute);
