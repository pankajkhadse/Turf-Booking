import {
    getBookingById,
    getBookingsByUser,
    updateBookingStatus,
    getSlotsByBookingId,
    deleteBookingSlots,
    getBookingsByTurf,
    getSlotOccupancy,
    autoCompleteExpiredBookings
} from '../models/booking.model.js'

import { getTurfStats,getTurfById } from '../models/turf.model.js'
import { updateMultipleSlotStatus } from '../models/slot.model.js'
import { updatePaymentStatus } from '../models/payment.model.js'

// GET booking history — client sees their own bookings
export const getHistory = async (req, res) => {
    try {
        // auto-complete any confirmed bookings whose slot time has passed
        await autoCompleteExpiredBookings(req.user.id)
        const bookings = await getBookingsByUser(req.user.id)
        res.status(200).json({
            message: 'Booking history fetched',
            count: bookings.length,
            bookings
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// GET single booking details
export const getBooking = async (req, res) => {
    try {
        const booking = await getBookingById(req.params.id)

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // only the booking owner can see it
        if (Number(booking.user_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        res.status(200).json({ booking })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// // CANCEL booking

// export const cancelBooking = async (req, res) => {
//     try {
//         const booking = await getBookingById(req.params.id)

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' })
//         }

//         if (Number(booking.user_id) !== Number(req.user.id)) {
//             return res.status(403).json({ message: 'Access denied' })
//         }

//         if (!['pending', 'confirmed'].includes(booking.status)) {
//             return res.status(400).json({
//                 message: `Cannot cancel a booking that is ${booking.status}`
//             })
//         }
        
//         // 🔥 NEW: time-based restriction
// console.log('slot date:', booking.slot_date)
// console.log('start time:', booking.start_time)

// if (booking.start_time && booking.slot_date) {
//   const now = new Date()

//   // ✅ combine date + time
//   const slotTime = new Date(
//     `${booking.slot_date} ${booking.start_time}`
//   )

//   console.log('slotTime:', slotTime)

//   if (now >= slotTime) {
//     return res.status(400).json({
//       message: 'Cannot cancel after slot time has started'
//     })
//   }
// }

//         // 1. get all slot ids linked to this booking
//         const slot_ids = await getSlotsByBookingId(booking.id)

//         // 2. free all slots back to available
//         await updateMultipleSlotStatus(slot_ids, 'available')

//         // 3. delete booking_slots rows ← THIS IS THE FIX
//         await deleteBookingSlots(booking.id)

//         // 4. update booking status to cancelled
//         await updateBookingStatus(booking.id, 'cancelled')

//         // 5. update payment if it was already confirmed
//         if (booking.status === 'confirmed') {
//             await updatePaymentStatus(booking.id, 'refunded')
//             return res.status(200).json({
//                 message: 'Booking cancelled. Refund will be processed in 5-7 days.'
//             })
//         }

//         res.status(200).json({ message: 'Booking cancelled successfully' })

//     } catch (err) {
//         console.error(err)
//         res.status(500).json({ message: 'Something went wrong' })
//     }
// }



// CANCEL booking — with 2hr before slot start restriction
export const cancelBooking = async (req, res) => {
    try {
        const booking = await getBookingById(req.params.id)

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        if (Number(booking.user_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        // check status — only pending or confirmed can be cancelled
        if (!['pending', 'confirmed'].includes(booking.status)) {
            return res.status(400).json({
                message: `Cannot cancel a booking that is already ${booking.status}`
            })
        }

        // 2hr restriction — block cancel if within 2 hours of slot start
        // getBookingById now returns slot_date and start_time from the JOIN
        if (booking.slot_date && booking.start_time) {
            const now = new Date()

            // build slot start datetime — slot_date is "2025-06-10", start_time is "06:00:00"
            const slotDateStr = booking.slot_date instanceof Date
                ? booking.slot_date.toISOString().split('T')[0]
                : String(booking.slot_date).split('T')[0]

            const slotStart = new Date(`${slotDateStr}T${booking.start_time}`)
            const twoHoursBefore = new Date(slotStart.getTime() - 2 * 60 * 60 * 1000)

            if (now >= twoHoursBefore) {
                // also check if slot has already passed
                if (now >= slotStart) {
                    return res.status(400).json({
                        message: 'Cannot cancel — slot has already started'
                    })
                }
                return res.status(400).json({
                    message: 'Cannot cancel within 2 hours of slot start. Cancellation is closed.'
                })
            }
        }

        // 1. get all slot ids linked to this booking
        const slot_ids = await getSlotsByBookingId(booking.id)

        // 2. free all slots back to available
        await updateMultipleSlotStatus(slot_ids, 'available')

        // 3. delete booking_slots rows so those slots can be rebooked
        await deleteBookingSlots(booking.id)

        // 4. update booking status to cancelled
        await updateBookingStatus(booking.id, 'cancelled')

        // 5. mark payment as refunded if booking was confirmed
        if (booking.status === 'confirmed') {
            await updatePaymentStatus(booking.id, 'refunded')
            return res.status(200).json({
                message: 'Booking cancelled. Refund will be processed in 5-7 business days.'
            })
        }

        res.status(200).json({ message: 'Booking cancelled successfully' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}



// GET all bookings for owner's turf
export const getTurfBookings = async (req, res) => {
    const { turf_id } = req.params

    try {
        // verify this turf belongs to the requesting owner
        const turf = await getTurfById(turf_id)
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' })
        }
        if (Number(turf.owner_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        const bookings = await getBookingsByTurf(turf_id)

        res.status(200).json({
            message: 'Bookings fetched',
            turf_name: turf.name,
            total: bookings.length,
            bookings
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// GET slot occupancy for a turf on a date
export const getTurfOccupancy = async (req, res) => {
    const { turf_id } = req.params
    const { date }    = req.query
    // GET /api/bookings/turf/:turf_id/occupancy?date=2025-06-10

    try {
        const turf = await getTurfById(turf_id)
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' })
        }
        if (Number(turf.owner_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        if (!date) {
            return res.status(400).json({ message: 'date query param required' })
        }

        const slots = await getSlotOccupancy(turf_id, date)

        const total     = slots.length
        const booked    = slots.filter(s => s.status === 'booked').length
        const available = slots.filter(s => s.status === 'available').length
        const pending   = slots.filter(s => s.status === 'pending').length

        res.status(200).json({
            date,
            turf_name:  turf.name,
            summary: {
                total,
                booked,
                available,
                pending,
                occupancy_percent: total > 0 ? Math.round((booked / total) * 100) : 0
            },
            slots
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// GET stats for owner's turf
export const getTurfDashboardStats = async (req, res) => {
    const { turf_id } = req.params

    try {
        const turf = await getTurfById(turf_id)
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' })
        }
        if (Number(turf.owner_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        const stats = await getTurfStats(turf_id)

        res.status(200).json({ turf_name: turf.name, stats })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}