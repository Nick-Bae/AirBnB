const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Reservation, Review, sequelize } = require('../../db/models');

const router = express.Router();
const {Op}=require("sequelize")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateReservation =[
    check('spotId')
        .exists({checkFalsy: true})
        .withMessage('')
]

//Get all of the Current User's Bookings
// router.get('/:userId', async(req, res)=>{
//     const reservations = await Reservation.findAll({
//         where: {userId: req.params.userId},
//         include: {model:Spot}
//     });
//     res.json(reservations)
// })

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
    const reservations = await Reservation.findAll({
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
        const reservInSpot = await Reservation.findAll({
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
            const newBooking = await Reservation.create({
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
    const editBooking = await Reservation.findByPk(req.params.reservationId)

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
    const date = await Reservation.findByPk(req.params.reservationId, {
    })
    let today = new Date().toISOString().slice(0,10)
    if (date.checkIn < today){
        res.json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 400
        })
    } else {

        const deleteBook = await Reservation.findByPk(req.params.reservationId)
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