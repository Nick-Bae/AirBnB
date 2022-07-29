const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Reservation, Review, sequelize, Image } = require('../../db/models');

const router = express.Router();
const {Op}=require("sequelize")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete('/:imageId/:imageableType', async(req, res)=>{
    const {user}=req
    const deleteImage = await Image.findByPk(req.params.imageId);
    res.json(deleteImage)
    // user.id === imageableId
    
})


module.exports = router;