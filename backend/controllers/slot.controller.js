import generateSlots from '../utils/generateSlots.js'
import { insertSlots } from '../models/slot.model.js'
import { getAvailableSlots } from '../models/slot.model.js'
import { getTurfById } from '../models/turf.model.js'
// import { createBooking } from '../models/booking.model.js'
import { getSlotsByIds, updateMultipleSlotStatus } from '../models/slot.model.js'
import { createBooking, linkSlotsToBooking } from '../models/booking.model.js'

// // API 1 — GENERATE SLOTS (owner only)
export const generate = async (req, res) => {
    const { turf_id, date, open_time, close_time, duration_minutes } = req.body

    console.log('turf_id from body:', turf_id)
    console.log('type:', typeof turf_id)

    const turf = await getTurfById(turf_id)
    console.log('turf from DB:', turf)

    try {
        // 1. check turf exists and belongs to this owner
        const turf = await getTurfById(turf_id)
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' })
        }
        if (Number(turf.owner_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'You do not own this turf' })
        }

        // 2. generate slot objects using util
        const slots = generateSlots(date, open_time, close_time, duration_minutes)
        if (slots.length === 0) {
            return res.status(400).json({ message: 'No slots could be generated. Check your times.' })
        }

        // 3. insert into DB — INSERT IGNORE skips duplicates automatically
        const inserted = await insertSlots(turf_id, slots)

        res.status(201).json({
            message: `${inserted} slots generated successfully`,
            slots
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// // API 2 — GET AVAILABILITY (public)
export const getAvailability = async (req, res) => {
    const { turf_id, date } = req.query
    // called as GET /api/slots/availability?turf_id=1&date=2025-06-10

    try {
        if (!turf_id || !date) {
            return res.status(400).json({ message: 'turf_id and date are required' })
        }

        const slots = await getAvailableSlots(turf_id, date)

        res.status(200).json({
            message: 'Available slots fetched',
            date,
            turf_id,
            available_slots: slots
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const bookSlot = async (req, res) => {
    const { slot_ids } = req.body
    // slot_ids is now an array → [3, 4, 5]
    const user_id = req.user.id

    try {
        // 1. validate — slot_ids must be an array with at least 1
        if (!Array.isArray(slot_ids) || slot_ids.length === 0) {
            return res.status(400).json({ message: 'slot_ids must be a non-empty array' })
        }

        // 2. fetch all slots from DB
        const slots = await getSlotsByIds(slot_ids)
        console.log(slots)
        if (slots.length !== slot_ids.length) {
            return res.status(404).json({ message: 'One or more slots not found' })
        }

        // 3. check same turf and same date
        const turf_ids = [...new Set(slots.map(s => s.turf_id))]
        const dates = [...new Set(slots.map(s => s.slot_date.toISOString().split('T')[0]))]

        if (turf_ids.length > 1) {
            return res.status(400).json({ message: 'All slots must be from the same turf' })
        }
        if (dates.length > 1) {
            return res.status(400).json({ message: 'All slots must be on the same date' })
        }

        // 4. check all slots are available
        const unavailable = slots.filter(s => s.status !== 'available')
        if (unavailable.length > 0) {
            return res.status(409).json({
                message: 'Some slots are no longer available',
                unavailable_slots: unavailable.map(s => s.id)
            })
        }

        // 5. check slots are consecutive

        const sorted = slots.sort((a, b) => a.start_time.localeCompare(b.start_time))
        const toHHMM = (time) => String(time).slice(0, 5)

        for (let i = 1; i < sorted.length; i++) {
            if (toHHMM(sorted[i].start_time) !== toHHMM(sorted[i - 1].end_time)) {
                return res.status(400).json({ message: 'Slots must be consecutive' })
            }
        }

        // 6. lock all slots immediately
        await updateMultipleSlotStatus(slot_ids, 'pending')

        // 7. calculate total price
        const start = new Date(`1970-01-01T${sorted[0].start_time}`)
        const end = new Date(`1970-01-01T${sorted[sorted.length - 1].end_time}`)
        const hours = (end - start) / (1000 * 60 * 60)
        const total_price = hours * slots[0].price_per_hour

        // 8. create one booking record
        const booking = await createBooking({
            user_id,
            turf_id: slots[0].turf_id,
            total_price
        })

        // 9. link all slots to this booking
        await linkSlotsToBooking(booking.id, slot_ids)

        res.status(201).json({
            message: `${slot_ids.length} slot(s) booked. Proceed to payment.`,
            booking_id: booking.id,
            total_price,
            booked_slots: sorted.map(s => ({
                slot_id: s.id,
                start_time: s.start_time,
                end_time: s.end_time
            })),
            date: dates[0]
        })

    } catch (err) {
        // free all slots back if anything fails
        if (req.body.slot_ids) {
            await updateMultipleSlotStatus(req.body.slot_ids, 'available')
        }
        console.error(err)
        res.status(500).json({ message: 'Booking failed, please try again' })
    }
}