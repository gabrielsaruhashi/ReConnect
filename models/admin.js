'use strict';

const mongoose = require('mongoose');

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const stringField = {
  type: String,
  minlength: 1,
  maxlength: 50,
};

const UserSchema = new Schema({
  email: {
    type: String,
    minlength: 1,
    maxlength: 50,
    lowercase: true,
    unique: true,
  },
  name: stringField,
  hashed_password: stringField,
});



UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.hashed_password, (err, isMatch) => {
    console.log('isMatch = ', isMatch);
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

UserSchema.statics.count = cb => this.model('Users').find({}, cb);

module.exports = mongoose.model('Users', UserSchema);
