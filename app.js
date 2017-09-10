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
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  passwordHash: { type: String }
});

//mongoose password storage

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


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})


app.listen(3000, function () {
  console.log('app running, port 3000; here....we....gooooo')});
