import Razorpay from 'razorpay'
import crypto from 'crypto'
import { getBookingById, updateBookingStatus, getSlotsByBookingId } from '../models/booking.model.js'
import { createPayment, getPaymentByBookingId } from '../models/payment.model.js'
import { updateMultipleSlotStatus } from '../models/slot.model.js'

const razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// STEP 1 — Initiate payment → create Razorpay order
export const initiatePayment = async (req, res) => {
    const { booking_id } = req.body

    try {
        const booking = await getBookingById(booking_id)

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // only the booking owner can pay
        if (Number(booking.user_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Booking is not in pending state' })
        }

        // create Razorpay order
        // Razorpay amount is in paise — multiply by 100
        const order = await razorpay.orders.create({
            amount:   Math.round(booking.total_price * 100),
            currency: 'INR',
            receipt:  `booking_${booking_id}`
        })

        res.status(200).json({
            message:    'Payment order created',
            order_id:   order.id,
            amount:     order.amount,
            currency:   order.currency,
            booking_id: booking_id,
            // send key to frontend so it can open Razorpay popup
            key_id:     process.env.RAZORPAY_KEY_ID
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Payment initiation failed' })
    }
}

// STEP 2 — Verify payment → confirm booking
export const verifyPayment = async (req, res) => {
    const { booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    try {
        // 1. verify signature — this is how you confirm payment is genuine
        const body = razorpay_order_id + '|' + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            // signature mismatch — payment is fake or tampered
            await updateBookingStatus(booking_id, 'failed')
            const slot_ids = await getSlotsByBookingId(booking_id)
            await updateMultipleSlotStatus(slot_ids, 'available')

            return res.status(400).json({ message: 'Payment verification failed' })
        }

        // 2. signature matches — payment is genuine
        // save payment record
        const booking = await getBookingById(booking_id)
        await createPayment({
            booking_id,
            gateway_txn_id: razorpay_payment_id,
            amount: booking.total_price,
            // correct ✅ — Razorpay sends the actual method used
            method: req.body.method || 'upi',
            status:         'success'
        })

        // 3. update booking to confirmed
        await updateBookingStatus(booking_id, 'confirmed')

        // 4. update all slots to booked
        const slot_ids = await getSlotsByBookingId(booking_id)
        await updateMultipleSlotStatus(slot_ids, 'booked')

        res.status(200).json({
            message:    'Payment successful. Booking confirmed!',
            booking_id,
            payment_id: razorpay_payment_id
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Payment verification failed' })
    }
}