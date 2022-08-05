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
        .withMessage(''),
]

// =============== Get all of the Current User's Bookings =================
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

            }
        }
    });

    const bookings = reservations.map(booking => place = {
        id: booking.id, spotId: booking.spotId,
        Spot: {
            address: booking.Spot.address, city: booking.Spot.city,
            state: booking.Spot.state, country: booking.Spot.country,
            lat: booking.Spot.lat, lng: booking.Spot.lng, name: booking.Spot.name,
            price: booking.Spot.price, previewImage: booking.Spot.Images[0].url
        },
        userId: booking.userId, startDate: booking.startDate, endDate: booking.endDate,
        createdAt: booking.createdAt, updatedAt: booking.updatedAt
    })

    res.json({ Bookings: bookings })
})

//=============Get all Bookings for a Spot based on t{he Spot's id==================
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
        attributes: { exclude: ['userId'] }
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



//==============Edit a Booking=========================
router.put('/:bookingId', async (req, res) => {
    const {user}=req;
    const { startDate, endDate } = req.body
    const editBooking = await Booking.findByPk(req.params.bookingId)
    let today = new Date().toISOString().slice(0, 10)

    if (editBooking === null) {
        res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
 if (user.id !== editBooking.id ) {
    res.json("No permission")
 }
// res.json(editBooking.id)
    const reservInSpot = await Booking.findAll({
        where: {
            spotId: editBooking.spotId,
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

    if (endDate < startDate) {
        res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot come before startDate"
            }
        })
    } else if (editBooking.endDate < today) {
        res.status(403).json(
            {
                "message": "Past bookings can't be modified",
                "statusCode": 403
            }
        )
    } else if (reservInSpot.length !== 0) {
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
        editBooking.update({
            startDate, endDate,
            // where: {id : req.params.bookingId}
        })
        res.json(editBooking)
    }
})

//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {

    try {
        const date = await Booking.findByPk(req.params.bookingId, {
        })
        let today = new Date().toISOString().slice(0, 10)
        const spot = await Spot.findOne({
            where: { id: date.spotId }
        })
        const { user } = req;
        // res.json(user.id)
        if (date.startDate < today) {
            res.json({
                "message": "Bookings that have been started can't be deleted",
                "statusCode": 400
            })
        } else if (user.id === parseInt(date.userId) || user.id === spot.ownerId) {
            const deleteBook = await Booking.findByPk(req.params.bookingId)
            deleteBook.destroy()
            res.status(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })
        } else {
            res.json("Booking must belong to the current user or the Spot must belong to the current user")

        }

    } catch (err) {
        res.status(404)
        res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
})
module.exports = router;