const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Booking, Review, sequelize, Image } = require('../../db/models');

const router = express.Router();
const { Op } = require("sequelize")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateReservation = [
    check('spotId')
        .exists({ checkFalsy: true })
        .withMessage('')
]

// ============ Get all of the Current User's Bookings =================
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    // res.json(user.id)
    const reservations = await Booking.findAll({
        where: { userId: user.id },
        include: {
            model: Spot,
            include: {
                model: Image,
                where: {
                    previewImage: true
                },
                as: "previewImage"
            }
        }
    });
    const image = await Image.find
    const bookings = reservations.map(booking => place = {
        id: booking.id, spotId: booking.spotId,
        Spot: {
            address: booking.Spot.address, city: booking.Spot.city,
            state: booking.Spot.state, country: booking.Spot.country,
            lat: booking.Spot.lat, lng: booking.Spot.lng, name: booking.Spot.name,
            price: booking.Spot.price, previewImage: booking.Spot.previewImage[0].url
        },
        userId: booking.userId, startDate: booking.startDate, endDate: booking.endDate,
        createdAt: booking.createdAt, updatedAt: booking.updatedAt
    })

    res.json({ Bookings: bookings })
})

//Get all Bookings for a Spot based on t{he Spot's id
router.get('/spot/:spotId/bookings', requireAuth, async (req, res) => {
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
        where: { spotId: req.params.spotId },
        attributes: {exclude:['userId']}
    })
    res.json(reservations)
    if (reservations.length === 0) {
        // if (!reservations){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json(reservations)
    }
})



//Edit a Booking
router.put('/:reservationId', async (req, res) => {
    const { checkIn, checkOut } = req.body
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
router.delete('/:reservationId', async (req, res) => {
    try {
        const date = await Booking.findByPk(req.params.reservationId, {
        })
        let today = new Date().toISOString().slice(0, 10)
        if (date.checkIn < today) {
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

    } catch (err) {
        res.status(404)
        res.json({
            "message": "Reservation couldn't be found",
            "statusCode": 404
        })
    }
})
module.exports = router;