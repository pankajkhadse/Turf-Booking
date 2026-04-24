import { createReview, getReviewsByTurf, checkReviewExists } from '../models/review.model.js'
import { getBookingById } from '../models/booking.model.js'

// ADD review
export const addReview = async (req, res) => {
    const { booking_id, rating, comment } = req.body

    try {
        // 1. check booking exists and belongs to this user
        const booking = await getBookingById(booking_id)

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        if (Number(booking.user_id) !== Number(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        // 2. can only review a completed booking
        if (booking.status !== 'completed') {
            return res.status(400).json({
                message: 'You can only review after completing a booking'
            })
        }

        // 3. check if review already exists for this booking
        const existing = await checkReviewExists(booking_id)
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this booking' })
        }

        // 4. validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' })
        }

        // 5. save review
        const review = await createReview({
            booking_id,
            user_id:  req.user.id,
            turf_id:  booking.turf_id,
            rating,
            comment
        })

        res.status(201).json({
            message: 'Review added successfully',
            review_id: review.id
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// GET all reviews for a turf
export const getTurfReviews = async (req, res) => {
    const { turf_id } = req.params

    try {
        const reviews = await getReviewsByTurf(turf_id)

        // calculate average rating
        const avgRating = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : null

        res.status(200).json({
            turf_id,
            average_rating: avgRating,
            total_reviews:  reviews.length,
            reviews
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}