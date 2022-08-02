const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Booking, Review, sequelize, Image } = require('../../db/models');

const router = express.Router();
const {Op}=require("sequelize")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateReservation =[
    check('spotId')
        .exists({checkFalsy: true})
        .withMessage('')
]

// ============ Get all of the Current User's Bookings =================
router.get('/current', async(req, res)=>{
    const {user}=req
    // res.json(user.id)
    const reservations = await Booking.findAll({
        where: {userId: user.id},
        // attributes: ['id','spotId'],
        include: [{model:Spot, attributes: {exclude:['description','createdAt','updatedAt']}},
        // {
        //                 model: Image,
        //                 where: {
        //                     previewImage: true
        //                 },
        //                 as: "previewImage"
        //             }
    ]
    });
    // const image = await Image.find
    const bookings = reservations.map(booking => place={
        id: booking.id, spotId: booking.spotId,
        Spot: {address: booking.Spot.address, city: booking.Spot.city,
            state: booking.Spot.state, country: booking.Spot.country,
            lat: booking.Spot.lat, lng: booking.Spot.lng, name: booking.Spot.name,
             price: booking.Spot.price,
        }, 
        userId: booking.userId, startDate: booking.startDate, endDate: booking.endDate,
        createdAt: booking.createdAt, updatedAt: booking.updatedAt
    })



    res.json({Bookings:bookings})
    // res.json({Bookings:reservations})
})

//Get all Bookings for a Spot based on t{he Spot's id
router.get('/spot/:spotId', async(req, res)=>{
    // try {
    //     const reservations = await Reservation.findAll({
    //         where : {spotId: req.params.spotId}
    //     })
    //     res.json(reservations)
    // } catch(err){
    //     res.status(404).json(
    //         {
    //             "message": "Spot couldn't be found",
    //             "statusCode": 404
    //           }
    //     )
    // }
    const reservations = await Booking.findAll({
                where : {spotId: req.params.spotId}
            })

    if (reservations.length === 0){
    // if (!reservations){
        res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
    } else {
        res.json(reservations)
    }
})

// Create a Booking from a Spot based on the Spot's id
router.post('/spot/:spotId/user/:userId', async(req, res)=>{
    // try{
        const {spotId, checkIn,checkOut} = req.body
        const spot = await Spot.findByPk(req.params.spotId)
        if (spot === null) res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
        })
        const reservInSpot = await Booking.findAll({
            where: {
                spotId: spotId,
                [Op.or]: [
                    {
                      checkIn: {
                        [Op.between]: [checkIn, checkOut]
                      }
                    },
                    {
                      checkOut: {
                        [Op.between]: [checkIn, checkOut]
                      }
                    }
                  ]
            }
        })
    
        if (reservInSpot.length !== 0){
            res.status(403).json(
                {
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                    }
                  }
            )
        } else {
            const newBooking = await Booking.create({
                spotId: req.params.spotId,
                userId: req.params.userId,
                checkIn,checkOut
            })
            res.json(newBooking)
        }
    // } catch (err){
    //     res.json({
    //             "message": "Spot couldn't be found",
    //             "statusCode": 404
    //           })
    // }
})

//Edit a Booking
router.put('/:reservationId', async(req, res)=>{
    const {checkIn,checkOut} = req.body
    const editBooking = await Booking.findByPk(req.params.reservationId)

    editBooking.update({
        checkIn, checkOut
    })

    if (editBooking === 'null') {
        res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    } else {
        
        res.json(editBooking)
    }
})

//Delete a Booking
router.delete('/:reservationId', async(req,res)=>{
    try{
    const date = await Booking.findByPk(req.params.reservationId, {
    })
    let today = new Date().toISOString().slice(0,10)
    if (date.checkIn < today){
        res.json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 400
        })
    } else {

        const deleteBook = await Booking.findByPk(req.params.reservationId)
        deleteBook.destroy()
        res.status(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200 
            })
    }
   
    }catch (err){
        res.status(404)
        res.json({
            "message": "Reservation couldn't be found",
            "statusCode": 404
        })
    }
})
module.exports = router;