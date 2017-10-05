const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const usersSchema = new Schema({
  username: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  hash: {type: String}
});

const User = mongoose.model("User", usersSchema);

usersSchema.methods.setPassword = function(password) {
  this.hash = bcrypt.hashSync(password, 10);
};

usersSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.hash);
};
usersSchema.statics.authenticate = function(username, password) {
  return (
    User.findOne({username: username})
      .then(user => {
        if (user && user.validatePassword(password)) {
          return user;
        } else {
          return null;
        }
      })
  );
};

module.exports = User;
