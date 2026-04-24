import pool from '../config/db.js'

export const createReview = async ({ booking_id, user_id, turf_id, rating, comment }) => {
    const [result] = await pool.query(
        `INSERT INTO reviews (booking_id, user_id, turf_id, rating, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [booking_id, user_id, turf_id, rating, comment]
    )
    return { id: result.insertId }
}

export const getReviewsByTurf = async (turf_id) => {
    const [rows] = await pool.query(
        `SELECT reviews.*, users.name AS reviewer_name
         FROM reviews
         JOIN users ON reviews.user_id = users.id
         WHERE reviews.turf_id = ?
         ORDER BY reviews.created_at DESC`,
        [turf_id]
    )
    return rows
}

export const checkReviewExists = async (booking_id) => {
    const [rows] = await pool.query(
        `SELECT id FROM reviews WHERE booking_id = ?`,
        [booking_id]
    )
    return rows[0]
}