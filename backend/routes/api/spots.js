const express = require('express');
const moment = require('moment')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, sequelize, Image, Booking } = require('../../db/models');

const router = express.Router();
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const user = require('../../db/models/user');
const spot = require('../../db/models/spot');
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

//================ Add Query Filters to Get All Spots==========================
router.get('/', validatePage, validatePrice, async (req, res, next) => {
    //page

    let pagination = {};
    let { page, size } = req.query;
    console.log(req.query)
    page = page === undefined ? 1 : parseInt(page);
    size = size === undefined ? 20 : parseInt(size);
    if (size >= 1 && page >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
        //    } else if (size<0){
        //     // res.json({"size": "Size must be greater than or equal to 0" })
        //     res.body.errors.size = "Size must be greater than or equal to 0"
        //     res.json(res.body.errors)
        // } else if (page<0){

    }
    

    const spots = await Spot.findAll({
        include: [
            {
                model: Image, attributes: ['url'],
            },
        ],
        // attributes: {
        //     include: [
        //      [
        //         sequelize.fn( "DATE_FORMAT", sequelize.col("createdAt"), "%d-%m-%Y %H:%i:%s"),
        //      ],
        //      ],
        //   },
        ...pagination
    })

    const avgRating = await Spot.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn('AVG', sequelize.col('Reviews.stars')), "avgRating"
                ],
            ]
        },
        include: [
                 { model: Review, attributes: [] },
        ],
        group: ['Spot.id'],
    })
    // res.json(avgRating)

    let Spots = [];

    for (i = 0; i < spots.length; i++) {
        if (spots[i].Images[0]) {
            spots[i] = {
                id: spots[i].id, ownerId: spots[i].ownerId,
                address: spots[i].address, city: spots[i].city,
                state: spots[i].state, country: spots[i].country,
                lat: spots[i].lat, lng: spots[i].lng, name: spots[i].name,
                description: spots[i].description, price: spots[i].price,
                createdAt: spots[i].createdAt, updatedAt: spots[i].updatedAt,
                avgRating: Number(Number(avgRating[i].dataValues.avgRating).toFixed(1)),
                previewImage: spots[i].Images[0].url
            }
            Spots.push(spots[i])
        } else {
            spots[i] = {
                id: spots[i].id, ownerId: spots[i].ownerId,
                address: spots[i].address, city: spots[i].city,
                state: spots[i].state, country: spots[i].country,
                lat: spots[i].lat, lng: spots[i].lng, name: spots[i].name,
                description: spots[i].description, price: spots[i].price,
                createdAt: spots[i].createdAt, updatedAt: spots[i].updatedAt,
                avgRating: Number(Number(avgRating[i].dataValues.avgRating).toFixed(1)),
                // previewImage: spots[i].Images[0].url
            }
            Spots.push(spots[i])
        }
    }

    //minPrice, maxPrice
    if (req.query.minPrice) {
        Spots = Spots.filter(spot => spot.price >= parseInt(req.query.minPrice));
    }

    if (req.query.maxPrice) {
        Spots = Spots.filter(spot => spot.price <= parseInt(req.query.maxPrice))
    }

    res.json({ Spots, page, size })

})

// =====================Get all Spots=========================
router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn('AVG', sequelize.col('Reviews.stars')), "avgRating"
                ],
                // [sequelize.literal("Images.url"), "previewImage"]
            ]
        },
        include: [
            {
                model: Image, attributes: ['url', 'previewImage'],
            },
            { model: Review, attributes: [] },
        ],
        group: ['Spot.id', 'Images.id'],
    })

    let Spots = [];

    for (i = 0; i < spots.length; i++) {
        if (spots[i].Images[0]) {
            spots[i] = {
                id: spots[i].id, ownerId: spots[i].ownerId,
                address: spots[i].address, city: spots[i].city,
                state: spots[i].state, country: spots[i].country,
                lat: spots[i].lat, lng: spots[i].lng, name: spots[i].name,
                description: spots[i].description, price: spots[i].price,
                createAt: spots[i].createdAt, updateAt: spots[i].updatedAt,
                avgRating: Number(Number(spots[i].dataValues.avgRating).toFixed(1)),
                previewImage: spots[i].Images[0].url
            }
            Spots.push(spots[i])
        } else {
            spots[i] = {
                id: spots[i].id, ownerId: spots[i].ownerId,
                address: spots[i].address, city: spots[i].city,
                state: spots[i].state, country: spots[i].country,
                lat: spots[i].lat, lng: spots[i].lng, name: spots[i].name,
                description: spots[i].description, price: spots[i].price,
                createAt: spots[i].createdAt, updateAt: spots[i].updatedAt,
                avgRating: Number(Number(spots[i].dataValues.avgRating).toFixed(1)),
                // previewImage: spots[i].Images[0].url
            }
            Spots.push(spots[i])
        }
    }
    res.json(Spots)
})

// ===============Get all Spots owned by the Current User(55:28)==============
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: { ownerId: user.id },
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgRating"]
            ]
        },
        include: [
            { model: Image, attributes: ['url'] },
            { model: Review, attributes: [] }
        ], group: ['Spot.id', 'Images.id']
    })

    let Spots = [];

    for (i = 0; i < spots.length; i++) {
        if (spots[i].Images[0]) {
            spots[i] = {
                id: spots[i].id, ownerId: spots[i].ownerId,
                address: spots[i].address, city: spots[i].city,
                state: spots[i].state, country: spots[i].country,
                lat: spots[i].lat, lng: spots[i].lng, name: spots[i].name,
                description: spots[i].description, price: spots[i].price,
                createAt: spots[i].createdAt, updateAt: spots[i].updatedAt,
                avgRating: Number(Number(spots[i].dataValues.avgRating).toFixed(1)),
                previewImage: spots[i].Images[0].url
            }
            Spots.push(spots[i])
        } else {
            spots[i] = {
                id: spots[i].id, ownerId: spots[i].ownerId,
                address: spots[i].address, city: spots[i].city,
                state: spots[i].state, country: spots[i].country,
                lat: spots[i].lat, lng: spots[i].lng, name: spots[i].name,
                description: spots[i].description, price: spots[i].price,
                createAt: spots[i].createdAt, updateAt: spots[i].updatedAt,
                avgRating: Number(Number(spots[i].dataValues.avgRating).toFixed(1)),
                // previewImage: spots[i].Images[0].url
            }
            Spots.push(spots[i])
        }
    }
    res.json({ Spots })
    // res.json(Spots)
})
// 



//=================Get details of a Spot from an id (56:23)==============
router.get('/:spotId', async (req, res) => {

    let detail = await Spot.findByPk(req.params.spotId)

    if (!detail) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    const revAvg = await Review.findAll({
        where: { spotId: req.params.spotId },
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col("review")), "numReviews"],
                [sequelize.fn('AVG', sequelize.col("stars")), "avgRating"]
            ]
        }, group: ['Review.id']
    })

    const image = await Image.findOne({
        where: { spotId: req.params.spotId },
        atrributes: { exclude: ['previewImage', 'spotId', 'reviewId', 'userId'] }
    })
    // res.json(detail)
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
        createAt: detail.createdAt, updateAt: detail.updatedAt,
        numReviews: revAvg[0].dataValues.numReviews,
        avgRating: Number(Number(revAvg[0].dataValues.avgRating).toFixed(1)),
        Images: detail = [{ id: image.id, imageableId: image.spotId, url: image.url }],
        Owner: detail = owner,
    }
    res.json(response)

})

//===============Create a Spot================
router.post('/', requireAuth, validateCreateSpot, async (req, res) => {
    const { user } = req;
// const {createdAt}= req
function getDateWithoutTime(date) {
    return require('moment')(date).format('YYYY-MM-DD');
}
    const { address, city, state, country,
        lat, lng, name, description, price,createdAt } = req.body
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
        price,
        // date: getDateWithoutTime(createdAt)
        createdAt
        //createdAt: moment(req.getDataValue('updatedAt')).format('YYYY-MM-DD hh:mm:ss'),
      //  updatedAt
    //    createdAt: createdAt
    })
    const newSpot2 = {
        id: newSpot.id,
        ownerId: user.id,
        address: newSpot.address,
        city: newSpot.ciy,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt
    }
    // res.status(201).json(newSpot)
    res.status(201).json(newSpot2)
})

//============== Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { user } = req;
    const { url } = req;
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
            url,
            spotId: req.params.spotId,
            userId: user.id
        })
        res.json({
            id: newImage.id,
            imageableId: newImage.spotId,
            url: newImage.url
        });
    }
})

//==============Edit a Spot===================
router.put('/:spotId', requireAuth, validateCreateSpot, async (req, res) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else if (user.id === parseInt(spot.ownerId)) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const editSpot = await Spot.findByPk(req.params.spotId)
        editSpot.update({
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        })
        res.status(200)
        res.json(editSpot)
    } else {
        res.status(403).json("No permission")
    }
})
//==============Delete a Spot===================
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
})



// ===========Get all Reviews by a Spot's id============
router.get('/:spotId/reviews', requireAuth, async (req, res) => {
    const reviewSpot = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Image, attributes: ['id', ['spotId', 'imageableId'], 'url'] }]
    })

    if (!reviewSpot || reviewSpot.length === 0) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json({ Reviews: reviewSpot })
    }
})


const validateReview = (req, res, next)=>{
    const { stars } = req.body
    if (stars < 1 || stars > 5) {
        const error = new Error;
        error.page = "Stars must be an integer from 1 to 5"
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            error
        })
        
    }
    next()
}

//==========Create a Review for a Spot based on the Spot's id=====================
router.post('/:spotId/reviews', requireAuth, restoreUser, validateReview, async (req, res) => {
    const { user } = req
    const { review, stars } = req.body
    const isUserReview = await Review.findOne({
        where: {
            userId: user.id,
            spotId: req.params.spotId
        }
    })
    const spot = await Spot.findByPk(req.params.spotId)

    //res.json(isUserReview)
    if (isUserReview) {
        res.status(403).json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    } else if (!spot || spot.length === 0) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        const newReview = await Review.create({
            userId: user.id, spotId: req.params.spotId, review, stars
        })
        res.json(newReview)
    }
})

//==========Get all Bookings for a Spot based on t{he Spot's id============
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const { user } = req;
    const noUser = await Booking.findAll({
        where: { spotId: req.params.spotId },
        attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }
    })
    const currentUser = await Booking.findAll({
        where: { spotId: req.params.spotId },
    })
    const response = currentUser.map(booking => booking = {
        User: { id: user.id, firstName: user.firstName, lastName: user.lastName },
        id: booking.id, spotId: booking.spotId, userId: booking.userId,
        startDate: booking.startDate, endDate: booking.endDate,
        createdAt: booking.createdAt, updatedAt: booking.updatedAt
    })
    if (currentUser.length === 0) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else if (user.id === currentUser[0].userId) {
        res.json({ Bookings: response })
    } else {
        res.json({ Bookings: noUser })
    }

})

// const validateBookingDate = [
//     check('endDate').custom((value)=>{
//         if (value< )

// }),
//     handleValidationErrors
// ]

const validateBookingDate = (req, res, next) => {
    const { startDate, endDate } = req.body
    // res.json(startDate)
    if (startDate > endDate) {
        const error = new Error;
        error.page = "endDate cannot be on or before startDate"
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            error
        })
        next(err)
    }
    next()
}

// =============Create a Booking from a Spot based on the Spot's id=============
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body
    const spot = await Spot.findByPk(req.params.spotId)
    const duplicateBooking = await Booking.findOne({
        where: { userId: user.id, startDate: startDate, endDate: endDate }
    })
    // res.json(spot)

    if (spot === null) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else if (startDate > endDate) {
        const error = new Error;
        error.endDate = "endDate cannot be on or before startDate"
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            error
        })
    } else if (spot.ownerId === user.id) {
        res.status(404).json("Cannot book this spot. Spot must NOT belong to the current user ")
    } else if (duplicateBooking) {
        res.status(404).json("You already have a booking on the date")
    }
    const reservInSpot = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            ]
        }
    })

    // if (startDate > reservInSpot.startDate) let conflict = startDate

    if (reservInSpot.length !== 0) {
        let conflict = startDate > reservInSpot[0].startDate && endDate > reservInSpot[0].endDate ? 'Start Date' : 'End date'
        if (conflict === 'Start Date') {
            res.status(403).json(
                {
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                        "startDate": "Start date conflicts with an existing booking",
                        // "endDate": "End date conflicts with an existing booking"
                    }
                }
            )
        } else {
            res.status(403).json(
                {
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                        // "`startDate`": `${conflict} conflicts with an existing booking`,
                        "endDate": "End date conflicts with an existing booking"
                    }
                }
            )
        }

    } else {
        const newBooking = await Booking.create({
            spotId: req.params.spotId,
            userId: user.id,
            startDate, endDate
        })
        res.json(newBooking)
    }
})

module.exports = router;