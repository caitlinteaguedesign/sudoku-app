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

exports.create = (req,res, next) => {
   const email = req.body.email;

   User.find({email: email}).exec()
      .then(users => {
         // we have a unique email address
         if(users.length == 0) {
            const user = new User({
               _id: new mongoose.Types.ObjectId(),
               name: req.body.name,
               email: email,
               password: req.body.password
            });
         
            user.save()
               .then( result => {
                  res.status(201).json({
                     message: 'User added',
                     user: {
                        id: result._id,
                        name: result.name
                     },
                     request: {
                        type: 'GET',
                        url: 'http://localhost:4000/users/' + result._id
                     }
                  })
               })
               .catch( err => {
                  console.log(err);
                  res.status(500).json({
                     error: err
                  });
               })
         }
         else {
            res.status(409).json({
               message: 'Email already is use'
            })
         }
      })
}

exports.update = (req, res, next) => {
   const id = req.params.id;
   const updateOps = {};

   for (const ops of req.body) {
      updateOps[ops.property] = ops.value;
   }

   // if(updateOps['email']) {
   //    const email = updateOps['email'];
   //    let user = User.findOne({email});
   //    if (user) {
   //       res.status(404).send('Email already in use');
   //    } 
   // }

   User.findByIdAndUpdate({_id: id}, {$set: updateOps}, { runValidators: true }).exec()
      .then( result => {
         res.status(200).json({
            message: 'User updated',
            updates: updateOps,
            request: {
               type: 'GET',
               url: 'http://localhost:4000/users/' + id
            }
         })
      })
      .catch( err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
}

exports.delete = (req, res, next) => {
   const id = req.params.id;

   User.findByIdAndDelete(id).exec()
      .then( result => {
         if(result) {
            res.status(200).json({
               message: 'User deleted',
               result: result.email
            })
         }
         else {
            res.status(404).json({
               message: 'User not found'
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