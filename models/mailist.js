'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const MailistSchema = new Schema({
  email: {
    type: String,
    minlength: 1,
    maxlength: 50,
    lowercase: true,
    unique: true,
  }
});


module.exports = mongoose.model('Mailist', MailistSchema);
