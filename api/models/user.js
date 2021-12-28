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
      modes: [{
         mode: {
            type: String,
            default: 'default'
         }
      }]
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
            default: '',
            match: /^#([0-9a-f]{3}){1,2}$/i
         },
         family: {
            type: String,
            default: 'sans',
            enum: ['sans', 'cursive'],
         },
         weight: {
            type: String,
            default: 'bold',
            enum: ['normal', 'bold'],
         },
         style: {
            type: String,
            default: 'normal',
            enum: ['normal', 'italic'],
         }
      },
      default: {
         color: {
            type: String,
            default: '',
            match: /^#([0-9a-f]{3}){1,2}$/i
         },
         family: {
            type: String,
            default: 'cursive',
            enum: ['sans', 'cursive'],
         },
         weight: {
            type: String,
            default: 'normal',
            enum: ['normal', 'bold'],
         },
         style: {
            type: String,
            default: 'normal',
            enum: ['normal', 'italic'],
         }
      },
      guess: {
         color: {
            type: String,
            default: '',
            match: /^#([0-9a-f]{3}){1,2}$/i
         },
         family: {
            type: String,
            default: 'cursive',
            enum: ['sans', 'cursive'],
         },
         weight: {
            type: String,
            default: 'normal',
            enum: ['normal', 'bold'],
         },
         style: {
            type: String,
            default: 'italic',
            enum: ['normal', 'italic'],
         }
      }
   }
});

module.exports = mongoose.model('User', userSchema); // User == users (the actual name of the collection) in mongoose