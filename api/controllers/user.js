const mongoose = require('mongoose');
const User = require('../models/user');

exports.getAll = (req, res, next) => {
   User.find()
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

   User.findById(id)
      .select('-__v -_id')
      .exec()
      .then( result => {
         if(result) {
            res.status(200).json({
               message: 'User found',
               result: result
            })
         }
         else {
            res.status(404).json({
               message: 'User not found'
            })
         }
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
}