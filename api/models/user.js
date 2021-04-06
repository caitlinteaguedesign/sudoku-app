const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
   },
   verified: {
      type: Boolean,
      default: false
   },
   password: {
      type: String,
      required: true
   },
   puzzles: Array,
   role: {
      type: String,
      required: true,
      default: 'player'
   }
});

module.exports = mongoose.model('User', userSchema, 'users')