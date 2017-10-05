
const mongoose = require("mongoose");

const codeSnippetSchema = new mongoose.Schema({
  id: {type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true
  },
  title: {type: String, required: true},
  body: {type: String, required: true},
  notes: {type: String},
  language: {type: String, required: true},
  tags: {type: Array, required: true, default: []}
})

const codeSnippet = mongoose.model("codeSnippet", snippetSchema);

module.exports = codeSnippet;
