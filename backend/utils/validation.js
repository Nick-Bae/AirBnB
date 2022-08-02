const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

      const err = Error('Validation error');
      err.status = 400;

    // const errName = errors[0].split(" ")
    // errors = errName[0]
    // // _res.json(errors)

    // let error;
    // if (errors === 'Password') {
    //   error = { password: "Password is required" }
    // } else if (errors === 'Email') {
    //   error = { credential: "Email or username is required" }
    // } else if (errors === 'First') {
    //   error = { firstName: "First Name is required" }
    // } else if (errors === 'Last') {
    //   error = { lastName: "Last Name is required" }
    // } else if (errors === 'Username') {
    //   error = { username: "Username is required" }
    // } else if (errors === 'Invalid') {
    //   error = { email: "Invalid email" }
    // } else if (errors === 'Password') {
    //   error = { password: "IPassword is required" }
    // } else {
      
    // }
    err.errors = errors
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};