import pool from '../config/db.js'

export const createBooking = async ({ user_id, turf_id, total_price }) => {
    const [result] = await pool.query(
        `INSERT INTO bookings (user_id, turf_id, total_price, status)
         VALUES (?, ?, ?, 'pending')`,
        [user_id, turf_id, total_price]
    )
    return { id: result.insertId }
}

// link multiple slots to one booking
export const linkSlotsToBooking = async (booking_id, slot_ids) => {
    const values = slot_ids.map(slot_id => [booking_id, slot_id])
    await pool.query(
        `INSERT INTO booking_slots (booking_id, slot_id) VALUES ?`,
        [values]
    )
}


// export const getBookingById = async (id) => {
//     const [rows] = await pool.query(
//         `SELECT bookings.*, turfs.name AS turf_name, turfs.city,
//                 users.name AS customer_name
//          FROM bookings
//          JOIN turfs ON bookings.turf_id = turfs.id
//          JOIN users ON bookings.user_id = users.id
//          WHERE bookings.id = ?`,
//         [id]
//     )
//     return rows[0]
// }



// Fixed — returns slot_date, slot_times, start_time, end_time for ticket display
export const getBookingById = async (id) => {
    const [rows] = await pool.query(
        `SELECT
            bookings.*,
            turfs.name    AS turf_name,
            turfs.city,
            turfs.address,
            users.name    AS customer_name,
            MIN(slots.slot_date)  AS slot_date,
            MIN(slots.start_time) AS start_time,
            MAX(slots.end_time)   AS end_time,
            GROUP_CONCAT(
                CONCAT(
                    TIME_FORMAT(slots.start_time, '%H:%i'),
                    '-',
                    TIME_FORMAT(slots.end_time, '%H:%i')
                )
                ORDER BY slots.start_time
                SEPARATOR ', '
            ) AS slot_times
         FROM bookings
         JOIN turfs         ON bookings.turf_id  = turfs.id
         JOIN users         ON bookings.user_id  = users.id
         LEFT JOIN booking_slots ON bookings.id  = booking_slots.booking_id
         LEFT JOIN slots        ON booking_slots.slot_id = slots.id
         WHERE bookings.id = ?
         GROUP BY bookings.id`,
        [id]
    )
    return rows[0]
}


// Fixed — returns slot_date, slot_times, start_time, end_time for ticket display
export const getBookingsByUser = async (user_id) => {
    const [rows] = await pool.query(
        `SELECT
            bookings.*,
            turfs.name    AS turf_name,
            turfs.city,
            turfs.address,
            turfs.price_per_hour,
            MIN(slots.slot_date)  AS slot_date,
            MIN(slots.start_time) AS start_time,
            MAX(slots.end_time)   AS end_time,
            GROUP_CONCAT(
                CONCAT(
                    TIME_FORMAT(slots.start_time, '%H:%i'),
                    '-',
                    TIME_FORMAT(slots.end_time, '%H:%i')
                )
                ORDER BY slots.start_time
                SEPARATOR ', '
            ) AS slot_times,
            COUNT(booking_slots.slot_id) AS slot_count
         FROM bookings
         JOIN turfs          ON bookings.turf_id = turfs.id
         LEFT JOIN booking_slots ON bookings.id  = booking_slots.booking_id
         LEFT JOIN slots         ON booking_slots.slot_id = slots.id
         WHERE bookings.user_id = ?
         GROUP BY bookings.id
         ORDER BY bookings.booked_at DESC`,
        [user_id]
    )
    return rows
}

// export const getBookingsByUser = async (user_id) => {
//     const [rows] = await pool.query(
//         `SELECT bookings.*, turfs.name AS turf_name, turfs.city
//          FROM bookings
//          JOIN turfs ON bookings.turf_id = turfs.id
//          WHERE bookings.user_id = ?
//          ORDER BY bookings.booked_at DESC`,
//         [user_id]
//     )
//     return rows
// }

export const updateBookingStatus = async (id, status) => {
    await pool.query(
        `UPDATE bookings SET status = ? WHERE id = ?`,
        [status, id]
    )
}

export const getSlotsByBookingId = async (booking_id) => {
    const [rows] = await pool.query(
        `SELECT slot_id FROM booking_slots WHERE booking_id = ?`,
        [booking_id]
    )
    return rows.map(r => r.slot_id)
}

// add this to booking.model.js
export const deleteBookingSlots = async (booking_id) => {
    await pool.query(
        `DELETE FROM booking_slots WHERE booking_id = ?`,
        [booking_id]
    )
}

// get all bookings for a specific turf — owner use only
export const getBookingsByTurf = async (turf_id) => {
    const [rows] = await pool.query(
        `SELECT 
            bookings.id,
            bookings.total_price,
            bookings.status,
            bookings.booked_at,
            users.name  AS customer_name,
            users.phone_no AS customer_phone,
            users.email AS customer_email,
            GROUP_CONCAT(
                CONCAT(
                    TIME_FORMAT(slots.start_time, '%H:%i'),
                    '-',
                    TIME_FORMAT(slots.end_time,   '%H:%i')
                )
                ORDER BY slots.start_time
                SEPARATOR ', '
            ) AS slot_times,
            MIN(slots.slot_date) AS slot_date
         FROM bookings
         JOIN users        ON bookings.user_id = users.id
         JOIN booking_slots ON bookings.id = booking_slots.booking_id
         JOIN slots        ON booking_slots.slot_id = slots.id
         WHERE bookings.turf_id = ?
         GROUP BY bookings.id
         ORDER BY bookings.booked_at DESC`,
        [turf_id]
    )
    return rows
}

// get slot occupancy for a turf on a specific date
export const getSlotOccupancy = async (turf_id, date) => {
    const [rows] = await pool.query(
        `SELECT 
            slots.id,
            slots.start_time,
            slots.end_time,
            slots.status,
            users.name AS booked_by,
            bookings.id AS booking_id
         FROM slots
         LEFT JOIN booking_slots ON slots.id = booking_slots.slot_id
         LEFT JOIN bookings      ON booking_slots.booking_id = bookings.id
                                 AND bookings.status NOT IN ('cancelled','failed')
         LEFT JOIN users         ON bookings.user_id = users.id
         WHERE slots.turf_id = ? AND slots.slot_date = ?
         ORDER BY slots.start_time ASC`,
        [turf_id, date]
    )
    return rows
}


// auto-complete confirmed bookings whose slot end time has passed
export const autoCompleteExpiredBookings = async (user_id) => {
    await pool.query(
        `UPDATE bookings
         SET status = 'completed'
         WHERE user_id = ?
           AND status = 'confirmed'
           AND id IN (
               SELECT DISTINCT bookings.id
               FROM bookings
               JOIN booking_slots ON bookings.id = booking_slots.booking_id
               JOIN slots ON booking_slots.slot_id = slots.id
               WHERE bookings.user_id = ?
               GROUP BY bookings.id
               HAVING MAX(CONCAT(slots.slot_date, ' ', slots.end_time)) < NOW()
           )`,
        [user_id, user_id]
    )
}
