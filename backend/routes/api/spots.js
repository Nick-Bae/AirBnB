const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, sequelize, Image } = require('../../db/models');

const router = express.Router();
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateCreateSpot = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 15 })
        .withMessage('name must be less than 15 characters'),
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('city is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('state is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('country is required'),
    check('lat')
        .exists({ checkNull: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkNull: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkNull: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    // check('size')
    //     .custom(({req})=> req.query.size <0)
    //     .withMessage('Size must be greater than 0'),
    handleValidationErrors
];

const validatePage = (req, res, next) => {
    if (req.query.page < 0 || req.query.size < 0) {
        const error = new Error;
        error.page = "page and size must be greater than or equal to 0"
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            error
        })
        next(err)
    }
    next()
};
const validatePrice = (req, res, next) => {
    if (req.query.minPrice < 0 || req.query.maxPrice < 0) {
        const error = new Error;
        error.page = "Minimun and Maxium price must be greater than or equal to 0"
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            error
        })
    }
    next()
};

// Get all Spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll({
        attributes: {
            include: [
                // [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgRating"]
                [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgRating"]
            ]
        },
        include: [
            { model: Review, attributes: [] },
            { model: Image, as: 'previewImage', attributes: ['url'] },
        ]
    });

    res.json({
        Spots: allSpots
    })
})

// Get all Spots owned by the Current User(55:28)
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const Spots = await Spot.findAll({
        where: { ownerId: user.id },
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgRating"]
            ]
        },
        include: [
            { model: Review, attributes: [] },
            { model: Image, as: 'previewImage', attributes: ['url'] },
        ]
    })

    // const spots = Spots.map(spot => spot)
    res.json({ Spots })
})

// Add Query Filters to Get All Spots
router.get('/', validatePage, validatePrice, async (req, res, next) => {
    //page

    let pagination = {};
    let { page, size } = req.query;
    console.log(req.query)
    page = page === undefined ? 1 : parseInt(page);
    size = size === undefined ? 3 : parseInt(size);
    if (size >= 1 && page >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
        //    } else if (size<0){
        //     // res.json({"size": "Size must be greater than or equal to 0" })
        //     res.body.errors.size = "Size must be greater than or equal to 0"
        //     res.json(res.body.errors)
        // } else if (page<0){

    }

    let spots = await Spot.findAll({

        ...pagination
    })

    let query = {
        where: {},
        include: []
    };

    //minPrice, maxPrice
    if (req.query.minPrice) {
        spots = spots.filter(spot => spot.price >= parseInt(req.query.minPrice));
    }

    if (req.query.maxPrice) {
        spots = spots.filter(spot => spot.price <= parseInt(req.query.maxPrice))
    }

    res.json({ spots, page, size })

})

//Get details of a Spot from an id (56:23)
router.get('/:spotId', async (req, res) => {

    let detail = await Spot.findByPk(req.params.spotId)

    // res.json(detail)
    const revAvg = await Review.findAll({
        where: { spotId: req.params.spotId },
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col("review")), "numReviews"],
                [sequelize.fn('AVG', sequelize.col("stars")), "avgRating"]
            ]
        },
    })
    const image = await Image.findOne({
        where: { spotId: req.params.spotId },
        atrributes: { exclude: ['previewImage', 'spotId', 'reviewId', 'userId'] }
    })
    res.json(image)
    const owner = await User.findOne({
        where: { id: detail.ownerId },
        attributes: { exclude: ['username'] }
    })
    let response = {
        id: detail.id, ownerId: detail.ownerId,
        address: detail.address, city: detail.city,
        state: detail.state, country: detail.country,
        lat: detail.lat, lng: detail.lng, name: detail.name,
        description: detail.description, price: detail.price,
        createAt: detail.createAt, updateAt: detail.updateAt,
        avgRating: revAvg[0].dataValues.avgRating,
        Images: detail = [image],
        Owner: detail = owner,
    }
    res.json(response)

    if (!detail || detail.id === null) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json(detail)
    }
})

//Create a Spot
router.post('/', requireAuth, validateCreateSpot, async (req, res) => {
    const { user } = req;

    const { address, city, state, country,
        lat, lng, name, description, price } = req.body
    const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201).json(newSpot)
})

//============== Add an Image to a Spot based on the Spot's id
router.post('/:spotId/image', requireAuth, async (req, res) => {
    const { user } = req
    const { url } = req.body
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else if (user === null || user.id !== parseInt(spot.ownerId)) {
        res.status(403).json("No Permission")
    } else {
        const newImage = await Image.create({
            // imageableId,
            spotId: req.params.spotId,
            url
        })
        res.json({
            id: newImage.id,
            imageableType: newImage.type,
            url: newImage.url
        });
    }
})

//Edit a Spot
router.put('/:spotId', requireAuth, validateCreateSpot, async (req, res) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId)
    // try {
    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else if (user.id === parseInt(spot.ownerId)) {
        const { name, address, totalOccupancy, totalRooms, totalBathrooms,
            hasKitchen, hasAC, hasHeating, hasWifi, isPetAllowed, price } = req.body
        const editSpot = await Spot.findByPk(req.params.spotId)
        editSpot.update({
            ownerId: user.id,
            name,
            address,
            totalOccupancy,
            totalRooms,
            totalBathrooms,
            hasKitchen,
            hasAC,
            hasHeating,
            hasWifi,
            isPetAllowed,
            price,
        })
        res.status(200)
        res.json(editSpot)
    } else {
        res.status(403).json("No permission")
    }
    // } catch(err){
    // }
})
//Delete a Spot
router.delete('/:spotId', restoreUser, async (req, res) => {
    // try {
    const { user } = req;
    const deleteSpot = await Spot.findByPk(req.params.spotId)
    if (!deleteSpot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else if (user === null || user.id !== deleteSpot.ownerId) {
        res.json("No Permission")
    } else {

        deleteSpot.destroy()
        res.status(200)
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
    // }catch (err){
    // }
})



// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const reviewSpot = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [{ model: User }, { model: image }]
    })

    if (!reviewSpot) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json({ Reviews: reviewSpot })
    }
})

module.exports = router;