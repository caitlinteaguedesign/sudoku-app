const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput (data) {
   let errors = {};

   data.name = !isEmpty(data.name) ? data.name : '';
   data.email = !isEmpty(data.email) ? data.email : '';
   data.password = !isEmpty(data.password) ? data.password : '';

   if(Validator.isEmpty(data.name)) {
      errors.name = 'A name is required';
   }

   if(Validator.isEmpty(data.email)) {
      errors.email = 'An email is required';
   }
   else if (!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
   }

   if(Validator.isEmpty(data.password)) {
      errors.password = 'A password is required';
   }

   return {
      errors,
      isValid: isEmpty(errors)
   }
}