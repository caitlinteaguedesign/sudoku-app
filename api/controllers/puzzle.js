const mongoose = require('mongoose');
const Puzzle = require('../models/puzzle');

exports.getAll = (req, res, next) => {
   Puzzle.find()
      .select('-__v')
      .exec()
      .then( data => {
         res.status(200).json(data);
      })
      .catch( err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
}