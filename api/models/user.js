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
   puzzles: [{
      id: {
         type: mongoose.Schema.Types.ObjectId,
         required: true
      },
      completed: {
         type: Boolean,
         default: false
      },
      state: {
         type: Array,
         default: []
      }
   }],
   role: {
      type: String,
      default: 'player'
   }
});

module.exports = mongoose.model('User', userSchema); // User == users (the actual name of the collection) in mongoose