const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, sequelize, Image } = require('../../db/models');
const {Op}=require("sequelize")
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('review text is required'),
    handleValidationErrors
]


//==============Get all Reviews of the Current User=============
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    const reviews = await Review.findAll({
        where: { userId: user.id },
        include: [
            { model: User, attributes: ['id','firstName','lastName'] },
            { model: Spot, 
                attributes: 
                { exclude: ["description","createdAt", "updatedAt"] } },
            {model:Image, attributes:['id',['spotId','imageableId'],'url']}
        ]
    })
    res.json(reviews)
})


//============== Get all Reviews by a Spot's id===========
// router.get('/spot/:spotId', async (req, res) => {
//     const reviewSpot = await Review.findAll({
//         where: { spotId: req.params.spotId },
//         include: { model: User }
//     })

//     if (!reviewSpot) {
//         res.status(404).json({
//             "message": "Spot couldn't be found",
//             "statusCode": 404
//         })
//     } else {
//         res.json({ review: reviewSpot })
//     }
// })


// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', async (req, res) => {
    const { user } = req;
    const { url } = req.body;
    const review = await Review.findByPk(req.params.reviewId);
   
    const countImage = await Image.count({
        where: {reviewId : req.params.reviewId, userId: user.id}
    })
   
//   res.json(countImage)

    const count =  await Review.count( {
        include: {model: Image, where: {reviewId : req.params.reviewId}}
    })
    // res.json(count)
// res.json(countImage[0].dataValues.countImage)

// const checkMaximumImage = countImage.map(function(image){
//     if (image.dataValues.countImage>10) 
//    return false
// })
let checkMaximumImage = 'true';
// = countImage.map(function(image){
//     if (image.dataValues.countImage>10) 
//    return  false
//    return false
// })
for (i=0; i < countImage.length; i++){
    if (countImage[i].dataValues.countImage > 10)  {checkMaximumImage = 'false'} break
} 
// res.json(checkMaximumImage)

    if (!review) {
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    } else if (user === null || user.id !== parseInt(review.userId)) {
        res.status(403).json("No permission")
    } else if (countImage > 10) {
        res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
          })
    } else {
        const addReviewImage = await Image.create({
            imageableId: review.spotId,
            url,
            spotId: review.spotId,
            reviewId: req.params.reviewId,
            userId: user.id
        })
        const response = {
            id: addReviewImage.id,
            imageableId: addReviewImage.spotId,
            url: addReviewImage.url
        }
        res.json(response)
    }
})

//========================  Edit a Review  ===================
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { review,stars } = req.body
    const {user}=req
    const editReview = await Review.findByPk(req.params.reviewId)
    const reviewId = req.params.reviewId
    // res.json(editReview)
    if (!editReview) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    } else if (user.id === parseInt(editReview.userId)) {
        editReview.update({ review, stars })
        res.json(editReview)
    } else {
        res.status(401).json("Unauthorized User")
    }
})

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    // try {
        const {user}=req
    const deleteReview = await Review.findByPk(req.params.reviewId)
    if (!deleteReview) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    } else if (user.id === parseInt(deleteReview.userId)){
        deleteReview.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    } else {
        res.status(401).json("No permission")
    }
})


module.exports = router;