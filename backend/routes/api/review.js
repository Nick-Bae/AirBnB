const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Reservation, Review, sequelize, Image } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateReview = [
    check('comment')
        .exists({ checkFalsy: true })
        .withMessage('comment text is required'),
    // check('userId')
    //     .exists({checkFalsy:true})
    //     .withMessage('User already has a review for this spot'),
    handleValidationErrors
]

//Get all Reviews of the Current User
// router.get('/:userId', async(req,res)=>{
//     const reviews = await Review.findAll({
//         where: {userId:req.params.userId },
//         include: [{model: User},{model: Spot} ],
//     })
//     res.json(reviews)
// })


// Get all Reviews by a Spot's id
router.get('/spot/:spotId', async (req, res) => {
    const reviewSpot = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: { model: User }
    })

    if (!reviewSpot) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json({ review: reviewSpot })
    }
})

//Create a Review for a Spot based on the Spot's id
router.post('/spot/:spotId/reviews', requireAuth, validateReview, async (req, res) => {

    try {
        const isUserReview = await Review.findOne({
            where: {
                userId: req.params.userId,
                spotId: req.params.spotId
            }
        })

        if (isUserReview !== null) {
            res.status(403).json({
                "message": "User already has a review for this spot",
                "statusCode": 403
            })
        } else {
            const { comment } = req.body
            const newReview = await Review.create({
                userId: req.params.userId, spotId: req.params.spotId, comment
            })
            res.json(newReview)
        }
    } catch (err) {

        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { comment } = req.body
    const editReview = await Review.findByPk(req.params.reviewId)

    if (req.user.id === parseInt(req.params.reviewId)) {
        editReview.update({ comment })
        res.json(editReview)
    } else if (!editReview) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    } else {
        res.status(401).json("Unauthorized User")
    }
})

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    // try {
        const deleteReview = await Review.findByPk(req.params.reviewId)
       if (req.user.id === parseInt(req.params.reviewId)) {
           deleteReview.destroy()
           res.json({
               "message": "Successfully deleted",
               "statusCode": 200
            })
       } else if (!deleteReview) {
           res.status(404).json({
               "message": "Review couldn't be found",
               "statusCode": 404
           })
       } else {
        res.status(401).json("Unauthorized User")
       }
})

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/image', async (req, res)=>{
    const {user} = req;
    const {url} = req.body;
    const review = await Review.findByPk(req.params.reviewId);
    const countReview = await Image.count({
    //   col: 'spotId'
    })

    if (!review){
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    } else if (user === null || user.id !== parseInt(review.userId)) {
        res.status(403).json("No permission")
    } else {
        const addReviewImage = await Image.create({
            imageableId: user.id,
            imageableType: "Review",
            url
        })
        res.json(
            // id:addReviewImage.id,
            // imageableId: 
            // imageableType: addReviewImage.type,
            // url:addReviewImage.url
            addReviewImage
        )
    }
})
module.exports = router;