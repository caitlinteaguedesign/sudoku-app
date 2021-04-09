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

exports.getById = (req, res, next) => {
   const id = req.params.id;

   Puzzle.findById(id)
      .select('-__v -_id')
      .exec()
      .then( result => {
         if(result) {
            res.status(200).json({
               message: 'Found a puzzle!',
               result: result
            })
         }
         else {
            res.status(404).json({
               message: 'No puzzle with that id'
            })
         }
      })
      .catch( err => {
         console.log(err);

         res.status(500).json({
            error: err
         })
      })
}