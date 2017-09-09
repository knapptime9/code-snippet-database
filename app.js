// NEED TO USE BCRYPTJS FOR USERS TO "CREATE NEW ACCOUNT"
// NEED TO USE PASSPORT TO AUTHENTICATE RETURNING USERS (PASSPORT DOES NOT HANDLE USER REGISTRATION)
//   Passport is an authentication module for EXPRESS.
const express = require('express');
const session = require('express-session');
const flash = require('express-flash-messages');

const app = express();
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bluebird = require('bluebird');
mongoose.Promise = bluebird;

const userSchema = new mongoose.Schema({
  // id : {type: String},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  // password: { type: String, required: true },
  passwordHash: { type: String }
});

// Example of safe storage password with Mongoose

userSchema.methods.setPassword = function (password) {
  const hash = bcrypt.hashSync(password, 8);
  this.passwordHash = hash;
}

userSchema.methods.authenticate = function (password) {
  console.log(password);
  console.log(this.passwordHash);
  return bcrypt.compareSync(password, this.passwordHash);
}



userSchema.statics.authenticate = function(username, password, done) {
    this.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            done(err, false)
        } else if (user && user.authenticate(password)) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
};

const User = mongoose.model('User', userSchema);


// EXAMPLE: LOG USERS IN WITH PASSPORT

// install packages passport and passport-local
  // npm install passport passport-local --save
  // npm install passport --save

// Require the packages
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

  // Configure passport to let it know how to look up and authenticate a user.
  // Below uses the securly storing passwords User model from the BCRYPTJS example above

// LocalStrategy is an authentication strategy using USERNAME and PASSWORD

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.authenticate(username, password, function(err, user) {
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "There is no user with that username and password."
                })
            }
        })
    }));

// Serialize and deserialize store user info in the session and pull it back out again
  passport.serializeUser(function(user, done) {
    console.log(user);
    console.log(user.id);
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

// Add Express-Session and Passport to middleware and express-flash-messages

// view engine setup
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views','./views');

app.use(session({
  secret: 'seeeeeeecreeeeeettt',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// middleware that requires a user to be authenticated
const requireLogin = (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Create login form (in handlebars file) and POST endpoint to submit login form to

app.get('/login', function(req, res) {
    res.render("loginForm", {
        messages: res.locals.getMessages()
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/createAccount',
    failureFlash: true
}))

app.get('/createAccount', function(req, res) {
    res.render("createAccount", {
        messages: res.locals.getMessages()
    });
});

app.post('/createAccount', (req, res) => {
  let user = new User(req.body);
  user.setPassword(req.body.password);

  user.save()
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err));
});

app.get('/', requireLogin, (req, res) => {
  res.render('home', {
      messages: res.locals.getMessages()
  });
});

// With all of this you are ready to log in users!

// EXAMPLE: HOW TO ACCESS THE CURRENT USER

// Passport puts the current user in req.user for us automatically. You may need this user in your views. Instead of passing it to every res.render statement, storing it in res.locals will make it available in all views. A simple middleware function will do this for us.

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})
