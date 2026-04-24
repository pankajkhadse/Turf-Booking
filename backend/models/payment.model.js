import pool from '../config/db.js'

export const createPayment = async ({ booking_id, gateway_txn_id, amount, method, status }) => {
    const [result] = await pool.query(
        `INSERT INTO payments (booking_id, gateway_txn_id, amount, method, status)
         VALUES (?, ?, ?, ?, ?)`,
        [booking_id, gateway_txn_id, amount, method, status]
    )
    return { id: result.insertId }
}

export const getPaymentByBookingId = async (booking_id) => {
    const [rows] = await pool.query(
        `SELECT * FROM payments WHERE booking_id = ?`,
        [booking_id]
    )
    return rows[0]
}

export const updatePaymentStatus = async (booking_id, status) => {
    await pool.query(
        `UPDATE payments SET status = ? WHERE booking_id = ?`,
        [status, booking_id]
    )
}