const express = require('express');

const { setTokenCookie, requireAuth,restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();
const {check}=require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

router.get('/', async(req, res, next)=>{
    const spot = await 
})