const express = require("express");
const passport = require("passport");
const routes = express.Router();
const local = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(new local(function(username, password, done) {
  User.authenticate(username, password)
    .then(user => {
    if (user) {
      done(null, user);
      } else {
        done(null, null, {message: "incorrect username or pass"});
      }
    })
    .catch(err => done(err));
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(user => done(null, user));
});

routes.get("/account", function(req, res) {
  res.render("account", {failed: req.query.falied});
});

routes.post("/account", passport.authenticate("local", {
  goodRedirect: "/",
  badRedirect: "/account?failed=true",
  failedFlash: true
}));

routes.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = routes;
