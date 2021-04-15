const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = async (req, res, next) => {
   try {
      const id = req.params.id;
      const updateOps = {};

      for (const ops of req.body) {
         updateOps[ops.property] = ops.value;
      }
   
      if(updateOps['email']) {
         let user = await User.findOne({email: updateOps['email']});

         // if this user exists AND we're updating a different user
         if (user && id != user._id) {
            return res.status(400).json({
               message: 'This email is already in use'
            });
         }
      }

      next();
   }
   catch(err) {
      console.log(err);
      return res.status(500).json({
         message: 'Something went wrong'
      });
   }
}