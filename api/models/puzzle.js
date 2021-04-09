const mongoose = require('mongoose');

const puzzleSchema = mongoose.Schema({
   _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
   },
   name: {
      type: String,
      required: true,
      trim: true
   },
   difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard', 'insane'],
      default: 'easy'
   },
   start: {
      type: Array,
      default: [],
      required: true
   },
   date_created: {
      type: Date,
      default: Date.now,
      required: true
   }
});

module.exports = mongoose.model('Puzzle', puzzleSchema, 'puzzles');