const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = async (req, res, next) => {
   try {
      let id = 0;
      let email = '';

      // we're updating an existing user
      if(req.params.id) id = req.params.id;

      // is there an email to check?
      if(req.body.email) email = req.body.email;
   
      if(email!='') {
         let user = await User.findOne({email: email});

         // if this user exists AND we're updating a different user
         if (user && id != user._id) {
            return res.status(400).json({
               email: 'This email is already in use'
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