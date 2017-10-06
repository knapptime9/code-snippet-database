const express = require("express");
const Snippet = require("../models/codeSnippet");
const routes = express.Router();

const loggedIn = function(req, res, next) {
  if (!req.user) {
    res.redirect("/account");
  } else {
    next();
  }
};

routes.use(loggedIn);

routes.get("/search", function(req, res) {
  var search = req.query.mySnippets;
  Snippet.find({author: req.user.username, $or: [{"language": search}, {tags: search}]})
  .then(snippets => res.render("search", {snippet: snippets}))
  .catch(err => res.send("No snippet found."));
});

module.exports = routes;
