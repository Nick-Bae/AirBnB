const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

const {ValidationError}=require('sequelize');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({ 
    policy: "cross-origin" 
  })
  );
  
  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
    );

const routes = require('./routes');
const user = require('./db/models/user');
app.use(routes);

app.use((_req,_res,next)=> {
  const err = new Error ("The requested resource couldn't be found");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

app.use((err, _req,_res, next) => {
  if (err instanceof ValidationError) {
    // let errorName = 'email'
    // if(err.errors[0].path === 'username'){
    
    //   _res.status(403).json({
    //     message: "User already exists",
    //     statusCode: 403,
    //     errors: {
    //       username:`User with that ${err.errors[0].path} already exists`
    //     }
    //   })
      err.errors = err.errors.map((e)=> e.message);
      // err.status
      err.title = 'validation error';
    // } else {
      // _res.status(403).json({
      //   message: "User already exists",
      //   statusCode: 403,
      //   errors: {
      //     email:`User with that ${err.errors[0].path} already exists`
      //   }
      // })
    // }
  }
  next(err);
});

app.use((err,_req,res,_next)=>{
  res.status(err.status || 500);
  console.error(err);
  res.json({
    // title: err.title || 'Server Error',
    message: err.message,
    statusCode:err.status,
    errors: err.errors,
    // stack: isProduction ? null : err.stack
  });
});




  module.exports = app;