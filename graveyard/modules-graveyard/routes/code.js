const express = require("express");
const mongoose = require("mongoose");
const routes = express.Router();
const Snippet = require("../models/codeSnippet");
const User = require("../models/user");

const loggedIn = function(req, res, next) {
  if (!req.user) {
    res.redirect("/account");
  } else {
    next();
  }
};

routes.use(loggedIn);

routes.get("/snippets/newCode", function(req, res) {
  if (req.query.id) {
    codeSnippet.findById(req.query.id)
    .then(codeSnippet => res.render("newCode", {codeSnippet: snippet}));
  } else {
    res.render("newCode");
  }
});

routes.post("/code", function(req, res) {
  if(!req.body._id) {
    req.body._id = new mongoose.mongo.ObjectID();
  }

  req.body.author = req.user.username;

  Snippet.findByIdAndUpdate(req.body._id, req.body, {upsert: true})
  .then(function() {
    res.redirect("/")
  })
  .catch(err => {
    res.render("code", {
      errors: err.erros,
      item: req.body
    });
  });
});

routes.get("/deleteSnippet", function(req, res) {
  codeSnippet.findById(req.query.id).remove()
  .then(function() {
    res.redirect("/");
  });
});

module.exports = routes;
