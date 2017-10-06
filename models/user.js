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
    })

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


// var User = module.exports = mongoose.model('User', userSchema);

// creates a hash from a password.
// module.exports.createUser = function(newUser, callback){
// 	bcrypt.genSalt(10, function(err, salt) {
// 	    bcrypt.hash(newUser.password, salt, function(err, hash) {
// 	        newUser.password = hash;
// 	        newUser.save(callback);
// 	    });
// 	});
// }

// Finds a document with the specificed username.
// userSchema.statics.getUserByUsername = function(username, callback){
// 	var query = {username: username};
// 	User.findOne(query, callback);
// }

// Finds a user by id.
// module.exports.getUserById = function(id, callback){
// 	User.findById(id, callback);
// }

// Compares a given password with a hash password to validate login.
// module.exports.comparePassword = function(candidatePassword, hash, callback){
// 	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     	if(err) throw err;
//     	callback(null, isMatch);
// 	});
// }

let User = mongoose.model('User', userSchema);
module.exports = {
  User
}
