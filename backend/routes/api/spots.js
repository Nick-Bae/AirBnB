const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Reservation, Review, sequelize, Owner } = require('../../db/models');

const router = express.Router();
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateCreateSpot =[
    check('name')
        .exists({checkFalsy: true})
        .isLength({max:15})
        .withMessage('name must be less than 15 characters'),
    check('address')
        .exists({checkFalsy:true})
        .withMessage('address is required'),
    check('totalOccupancy')
        .exists({checkFalsy:true})
        .withMessage('total occupancy is required'),
    check('totalRooms')
        .exists({checkFalsy:true})
        .withMessage('total rooms is required'),
    check('totalBathrooms')
        .exists({checkFalsy:true})
        .withMessage('total bathrooms is required'),
    check('hasKitchen')
        .exists({checkNull:true})
        .withMessage('hasKitchen should not be empty'),
    check('hasAC')
        .exists({checkNull:true})
        .withMessage('hasAC should not be empty'),
    check('hasHeating')
        .exists({checkFalsy:true})
        .withMessage('hasHeating should not be empty'),
    check('hasWifi')
        .exists({checkNull:true})
        .withMessage('hasWifi should not be empty'),
    check('isPetAllowed')
        .exists({checkNull:true})
        .withMessage('isPetAllowed should not be empty'),
    check('price')
        .exists({checkFalsy:true})
        .withMessage('price is required'),
    // check('size')
    //     .custom(({req})=> req.query.size <0)
    //     .withMessage('Size must be greater than 0'),
    handleValidationErrors
];

const validatePage = (req, res, next)=>{
    if (req.query.page < 0 || req.query.size <0) {
        const error = new Error;
        error.page="page and size must be greater than or equal to 0"
        res.status(400).json({
            "message":  "Validation Error",
            "statusCode": 400,
            error
        })
        next(err)
    }
    next()
};
const validatePrice = (req, res, next)=>{
    if (req.query.minPrice < 0 || req.query.maxPrice <0) {
        const error = new Error;
        error.page="Minimun and Maxium price must be greater than or equal to 0"
        res.status(400).json({
            "message":  "Validation Error",
            "statusCode": 400,
            error
        })
    }
    next()
};


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
   
       let query  = {
           where: {},
           include: []
       };
   
       //minPrice, maxPrice
       if (req.query.minPrice){
           spots = spots.filter(spot=>spot.price >= parseInt(req.query.minPrice));
       }
   
       if (req.query.maxPrice){
           spots = spots.filter(spot=>spot.price <= parseInt(req.query.maxPrice)) 
       }

       res.json({ spots,page,size })
   
})

// Get all Spots owned by the Current User
// router.get('/:userId', async (req, res) => {
//     const spotUserId = await Reservation.findAll({
//         where: { userId: req.params.userId },
//         attributes: ['spotId'],
//         include: [{ model: Spot }]
//     })
//     const spots = spotUserId.map(place => place.Spot)
//     res.json({ Spots: spots })
// })

//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    const detail = await Spot.findByPk(req.params.spotId,{
        attributes:{
            include:[
                [ sequelize.fn('COUNT', sequelize.col("Reviews.comment")), "numReviews"],
                [ sequelize.fn('AVG', sequelize.col("Reviews.rating")), "avgRating"]
             ]
        },
        include:[
            {model:Review, attributes:[]}, 
            {model:Owner}
        ]
    })

    if (!detail|| detail.id ===null){
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
router.post('/', validateCreateSpot, async (req,res)=>{
    const { ownerId,name, address,totalOccupancy,totalRooms,totalBathrooms,
        hasKitchen, hasAC, hasHeating, hasWifi,isPetAllowed, price}=req.body
    const newSpot = await Spot.create ({
      ownerId,
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
    res.status(201).json(newSpot)
})

//Edit a Spot
router.put('/:spotId', validateCreateSpot,async(req,res)=>{
    try {
        const { name, address,totalOccupancy,totalRooms,totalBathrooms,
            hasKitchen, hasAC, hasHeating, hasWifi,isPetAllowed, price}=req.body
        const editSpot = await Spot.findByPk(req.params.spotId) 
        editSpot.update({
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
    } catch(err){
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})
//Delete a Spot
router.delete('/:spotId', async(req,res)=>{
    try {
        const deleteSpot = await Spot.findByPk(req.params.spotId)
        deleteSpot.destroy()
        res.status(200)
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200 
        })
    }catch (err){
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

//add image by Id

router.post('/image/:spotId', async(req, res)=>{
    const {url}=req.body
    const image = await fetch("http://localhost:8000/spots/image/:spotId",{
        method: "POST",
        headers: { "Content-Type":"application/json"},
        body:url
    })
    const spot = Spot.findByPk(req.params.spotId);
    const newImage = await Spot.create({
        imageableId,
        imageableType: "Spot",
        url
    })
    res.json(newImage)


})

module.exports = router;