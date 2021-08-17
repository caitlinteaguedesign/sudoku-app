const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const validateLogin = require('../middleware/login');
const validateRegister = require('../middleware/register');

const { commonKeys } = require('../utilities/objectComparison');

const User = require('../models/user');
const passport = require('passport');

exports.getAll = (req, res, next) => {
   User.find()
      .select('-__v -puzzles')
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

exports.getSettingsById = (req, res, next) => {
   const id = req.params.id;

   User.findById(id)
      .select('-__v -_id -puzzles')
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


exports.register = (req,res, next) => {

   const { errors, isValid } = validateRegister(req.body);

   if(!isValid) {
      return res.status(400).json(errors);
   }

   bcrypt.hash(req.body.password, 10, function(err, hash) {
      if(err) {
         return res.status(500).json({
            error: err
         });
      }
      else {
         const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: hash
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
                     url: 'http://localhost:4000/users/id/' + result._id
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
   });

}

exports.login = (req, res, next) => {

   const { errors, isValid } = validateLogin(req.body);

   if(!isValid) {
      return res.status(400).json(errors);
   }

   const email = req.body.email;
   const password = req.body.password;

   User.findOne({email}).then(user => {
      if(!user) {
         return res.status(404).json({ login_email: "Email not found"});
      }

      bcrypt.compare(password, user.password).then(isMatch => {
         if(isMatch) {
            const payload = {
               id: user.id,
               name: user.name
               //puzzles: user.puzzles
            }
   
            jwt.sign(
               payload,
               keys.secretOrKey,
               {
                  expiresIn: 31556926 // 1 year in seconds
               },
               (err, token) => {
                  res.json({
                     success: true,
                     token: 'Bearer ' + token
                  });
               }
            );
         }
         else {
            return res.status(400).json({login_password: 'Password is incorrect'});
         }
      }).catch( err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      })

   }).catch( err => {
      console.log(err);
      res.status(500).json({
         error: err
      });
   });
}

exports.update = (req, res, next) => {
   const id = req.params.id;

   User.findByIdAndUpdate({_id: id}, {$set: req.body}, { runValidators: true }).exec()
      .then( result => {

         const changes = commonKeys(req.body, result);

         res.status(200).json({
            message: 'User updated',
            updates: {
               id: result._id,
               changes: changes
            },
            request: {
               type: 'GET',
               url: 'http://localhost:4000/users/id/' + id
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

exports.deleteUnverified = (req, res, next) => {
   User.deleteMany({verified: false}).exec()
      .then(result => {
         let message = 'No unverified users found';

         if(result.deletedCount>0) {
            message = 'Unverified users deleted';
         }
         res.status(200).json({
            message: message,
            count: result.deletedCount
         });
      })
      .catch( err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
}

exports.addPuzzleList = (req, res, next) => {
   const id = req.params.id;

   User.findByIdAndUpdate({_id: id}, {$addToSet: {puzzles: [req.body] } }, { runValidators: true }).exec()
      .then( result => {

         res.status(200).json({
            message: 'Puzzle added to user\'s list',
            updates: {
               id: result._id
            },
            request: {
               type: 'GET',
               url: 'http://localhost:4000/users/id/' + id
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

exports.updatePuzzleList = (req, res, next) => {
   const userId = req.params.id;
   const puzzleId = req.body.id;

   User.findOneAndUpdate({_id: userId, "puzzles.id": puzzleId}, 
      {$set: { 
         "puzzles.$.state": req.body.state,
         "puzzles.$.completed": req.body.completed,
         "puzzles.$.modes": req.body.modes }}, 
      { new: true, upsert: false, runValidators: true }).exec()
      .then( result => {
         res.status(200).json({
            message: 'Puzzle updated on user\'s list',
            result: result,
            request: {
               type: 'GET',
               url: 'http://localhost:4000/users/id/' + userId
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

exports.pullFromPuzzleList = (req, res, next) => {
   const userId = req.params.id;
   const puzzleId = req.body.id;

   User.findByIdAndUpdate({_id: userId}, 
      {$pull: { 
         "puzzles": {
            "id": puzzleId
         }
      }}, 
      { multi: true, new: true }).exec()
      .then( result => {
         res.status(200).json({
            message: 'Puzzle removed from user\'s list',
            result: result,
            request: {
               type: 'GET',
               url: 'http://localhost:4000/users/id/' + userId
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