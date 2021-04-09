const mongoose = require('mongoose');
const Puzzle = require('../models/puzzle');

exports.getAll = (req, res, next) => {
   Puzzle.find()
      .select('-__v -start')
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

exports.create = (req, res, next) => {
   const puzzle = new Puzzle({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      difficulty: req.body.difficulty,
      date_created: Date.now(),
      start: req.body.start
   })

   puzzle.save()
      .then( result => {
         res.status(201).json({
            message: 'Puzzle added',
            puzzle: {
               id: result._id,
               name: result.name
            },
            request: {
               type: 'GET',
               url: 'http://localhost:4000/puzzles/' + result._id
            }
         })
      })
      .catch( err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
}

exports.update = (req, res, next) => {
   const id = req.params.id;
   const updateOps = {};

   for (const ops of req.body) {
      updateOps[ops.property] = ops.value;
   }

   Puzzle.findByIdAndUpdate({_id: id}, {$set: updateOps}, { runValidators: true }).exec()
      .then( result => {
         res.status(200).json({
            message: 'Puzzle updated',
            updates: updateOps,
            request: {
               type: 'GET',
               url: 'http://localhost:4000/puzzles/' + id 
            }
         });
      })
      .catch( err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      });
}