let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
 username:  {type: String, required: true, unique: true, lowercase: true},
 email: {type: String, lowercase: true},
 passwordHash: {type: String, required: true},
    sessionID: {type: String}
  },
  {timestamps: true}
);

userSchema.virtual('password')
    .get(function() {
        return null
    })
    .set(function(value) {
        const hash = bcrypt.hashSync(value, 8);
        this.passwordHash = hash;
    });

    userSchema.methods.authenticate = function(password) {
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

    const snippetSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        codesnippet: {
            type: String,
            required: true
        },
        notes: {
            type: String
        },
        language: {
            type: String,
            required: true
        },
        privacy: {
            type: String,
            required: true
        },
        tags: {
            type: Array
        },
        user: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
  );

const Snippet = mongoose.model('Snippet', snippetSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  Snippet: Snippet
}
