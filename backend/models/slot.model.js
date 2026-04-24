import pool from '../config/db.js'
// get all available slots for a turf on a specific date
export const getAvailableSlots = async (turf_id, date) => {
    const [rows] = await pool.query(
        `SELECT id, start_time, end_time, status
         FROM slots
         WHERE turf_id = ? AND slot_date = ? AND status = 'available'
         ORDER BY start_time ASC`,
        [turf_id, date]
    )
    return rows
}

// insert multiple slots at once
export const insertSlots = async (turf_id, slots) => {
    // build bulk insert values
    const values = slots.map(s => [turf_id, s.slot_date, s.start_time, s.end_time, 'available'])

    const [result] = await pool.query(
        `INSERT IGNORE INTO slots (turf_id, slot_date, start_time, end_time, status)
         VALUES ?`,
        [values]
    )
    return result.affectedRows
}

// get multiple slots by their ids
export const getSlotsByIds = async (slot_ids) => {
    const [rows] = await pool.query(
        `SELECT slots.*, turfs.price_per_hour
         FROM slots
         JOIN turfs ON slots.turf_id = turfs.id
         WHERE slots.id IN (?)`,
        [slot_ids]
    )
    return rows
}

// update status of multiple slots at once
export const updateMultipleSlotStatus = async (slot_ids, status) => {
    // 1. Guard clause: Don't run the query if there are no IDs
    if (!slot_ids || slot_ids.length === 0) {
        console.warn("No slot IDs provided for update.");
        return; 
    }

    await pool.query(
        // The driver automatically expands [slot_ids] into a comma-separated list
        `UPDATE slots SET status = ? WHERE id IN (?)`,
        [status, slot_ids]
    );
};

