const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
   },
   name: {
      type: String,
      required: [true, 'Name required'],
      trim: true
   },
   email: {
      type: String,
      required: [true, 'Email required'],
      trim: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
   },
   verified: {
      type: Boolean,
      default: false
   },
   password: {
      type: String,
      required: [true, 'Password required'],
      trim: true
   },
   puzzles: [{
      _id: false,
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
      },
      modes: {
         type: Array,
         default: []
      }
   }],
   role: {
      type: String,
      enum: ['admin', 'player'],
      default: 'player'
   },
   game: {
      readonly: {
         color: {
            type: String,
            match: /^#([0-9a-f]{3}){1,2}$/i
         }
      },
      default: {
         color: {
            type: String,
            match: /^#([0-9a-f]{3}){1,2}$/i
         }
      },
      guess: {
         color: {
            type: String,
            match: /^#([0-9a-f]{3}){1,2}$/i
         }
      }
   }
});

module.exports = mongoose.model('User', userSchema); // User == users (the actual name of the collection) in mongoose