let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const snippetSchema = new Schema({
    title: {
        type: String,
        lowercase: true,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    lang: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    user: {
        type: String,
        lowercase: true,
        required: true
    }
},{timestamps: true});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = {
    Snippet: Snippet
};
