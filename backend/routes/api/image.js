const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, sequelize, Image } = require('../../db/models');

const router = express.Router();
const {Op}=require("sequelize")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete('/:imageId', requireAuth, async(req, res)=>{
    const {user}=req
    const deleteImage = await Image.findByPk(req.params.imageId);
    if (deleteImage === null) {
        res.status(404).json({
            "message": "Image couldn't be found",
            "statusCode": 404
          })
    } else if (user.id === deleteImage.userId) {
        deleteImage.destroy();
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
          })
    } else {
        res.status(403).json("No permission")
    }
})


module.exports = router;