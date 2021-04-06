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