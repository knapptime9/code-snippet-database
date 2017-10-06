const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const expressValidator = require('express-validator');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash-messages');
const List = require('./models/user');
const bcrypt = require('bcryptjs');
const models = require("./models/user")
const User = models.User;
const modelsSnippet = require("./models/snippet");
const Snippet = modelsSnippet.Snippet;

const LocalStrategy = require('passport-local').Strategy;
const mongoURL = 'mongodb://localhost:27017/test';
mongoose.connect(mongoURL, {useMongoClient: true});
mongoose.Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;

const routes = require('./routes.js');
const fs = require('fs');
let authorizedSession = "";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.text());
app.use(expressValidator());

app.use(cookieParser());
app.engine('mustache', mustacheExpress());
app.set('views', ['./views', './views/admin']);
app.set('view engine', 'mustache');

app.use(express.static(__dirname + '/public'));

app.use(flash());


app.use(session({
  secret: 'seeeeeeecreeeeettt',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000000, httpOnly: false}
}));

const getUserInfo = function(req, res, next) {
    User.findOne({_id: req.params.id}, req.body).then(function(users) {
        req.users = users;
        console.log(req.users);
        next();
    });
};


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.authenticate(username, password, function(err, user) {
          //HERE, USER is the entire user object
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: "There is no user with that username and password."
                });
            }
        });
    }
));
passport.serializeUser(function(userobj, done) {
    done(null, userobj.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, userobj) {
        done(err, userobj);
    });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});







app.use(routes);

app.listen(process.env.PORT || 3000, function() {
  console.log('heeereee.....weee....goooooo!');
});

module.exports = app;
