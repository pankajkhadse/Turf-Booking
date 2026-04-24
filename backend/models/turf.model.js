import pool from '../config/db.js'


export const createTurf = async (owner_id, { name, city, address, price_per_hour, status, sports }) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [result] = await conn.query(
      `INSERT INTO turfs (owner_id, name, city, address, price_per_hour, status) VALUES (?,?,?,?,?,?)`,
      [owner_id, name, city, address, price_per_hour, status || 'active']
    )
    const turf_id = result.insertId
    if (sports && sports.length > 0) {
      const values = sports.map(s => [turf_id, s])
      await conn.query(`INSERT INTO turf_sports (turf_id, sport_name) VALUES ?`, [values])
    }
    await conn.commit()
    return { id: turf_id }
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

   

// get all active turfs
// export const getAllTurfs = async () => {
//     const [rows] = await pool.query(
//         `SELECT turfs.*, users.name AS owner_name 
//          FROM turfs 
//          JOIN users ON turfs.owner_id = users.id
//          WHERE turfs.status = 'active'`
//     )
//     return rows
// }

export const getAllTurfs = async () => {
  const [rows] = await pool.query(`
    SELECT turfs.*,
           users.name AS owner_name,
           GROUP_CONCAT(turf_sports.sport_name) AS sports_csv
    FROM turfs
    JOIN users ON turfs.owner_id = users.id
    LEFT JOIN turf_sports ON turfs.id = turf_sports.turf_id
    WHERE turfs.status = 'active'
    GROUP BY turfs.id
  `)
  return rows.map(r => ({
    ...r,
    sports: r.sports_csv ? r.sports_csv.split(',') : []
  }))
}

// get single turf by id
export const getTurfById = async (id) => {
    const [rows] = await pool.query(
        `SELECT turfs.*, users.name AS owner_name 
         FROM turfs 
         JOIN users ON turfs.owner_id = users.id
         WHERE turfs.id = ?`,
        [id]
    )
    return rows[0]
}

// update turf
export const updateTurf = async (id, { name, city, address, price_per_hour, status }) => {
    const [result] = await pool.query(
        `UPDATE turfs 
         SET name = ?, city = ?, address = ?, price_per_hour = ?, status = ?
         WHERE id = ?`,
        [name, city, address, price_per_hour, status, id]
    )
    return result.affectedRows
}

// delete turf
export const deleteTurf = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM turfs WHERE id = ?`,
        [id]
    )
    return result.affectedRows
}

// get revenue and occupancy stats for owner's turf
export const getTurfStats = async (turf_id) => {
    const [rows] = await pool.query(
        `SELECT
            COUNT(DISTINCT bookings.id)                                  AS total_bookings,
            COALESCE(SUM(CASE WHEN bookings.status = 'confirmed'
                         THEN bookings.total_price ELSE 0 END), 0)       AS total_revenue,
            COUNT(DISTINCT CASE WHEN bookings.status = 'confirmed'
                           THEN bookings.id END)                         AS confirmed_bookings,
            COUNT(DISTINCT CASE WHEN bookings.status = 'cancelled'
                           THEN bookings.id END)                         AS cancelled_bookings,
            COUNT(DISTINCT CASE WHEN DATE(bookings.booked_at) = CURDATE()
                           THEN bookings.id END)                         AS today_bookings,
            COALESCE(SUM(CASE WHEN DATE(bookings.booked_at) = CURDATE()
                              AND bookings.status = 'confirmed'
                         THEN bookings.total_price ELSE 0 END), 0)       AS today_revenue,
            (SELECT COUNT(*) FROM slots
             WHERE slots.turf_id = ? AND slots.status = 'booked')        AS booked_slots,
            (SELECT COUNT(*) FROM slots
             WHERE slots.turf_id = ?)                                     AS total_slots
         FROM bookings
         WHERE bookings.turf_id = ?`,
        [turf_id, turf_id, turf_id]
    )
    return rows[0]
}

// ── Turf image model functions ──────────────────────────────

// get all photos for a turf
export const getTurfImages = async (turf_id) => {
    const [rows] = await pool.query(
        `SELECT * FROM turf_images WHERE turf_id = ? ORDER BY is_primary DESC, id ASC`,
        [turf_id]
    )
    return rows
}

// count how many photos a turf already has
export const getTurfImageCount = async (turf_id) => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM turf_images WHERE turf_id = ?`,
        [turf_id]
    )
    return rows[0].count
}

// insert one image record
export const insertTurfImage = async (turf_id, image_url, public_id, is_primary) => {
    const [result] = await pool.query(
        `INSERT INTO turf_images (turf_id, image_url, public_id, is_primary) VALUES (?, ?, ?, ?)`,
        [turf_id, image_url, public_id, is_primary ? 1 : 0]
    )
    return { id: result.insertId }
}

// get a single image by id
export const getTurfImageById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM turf_images WHERE id = ?`,
        [id]
    )
    return rows[0]
}

// delete an image record
export const deleteTurfImage = async (id) => {
    await pool.query(`DELETE FROM turf_images WHERE id = ?`, [id])
}

// set a new primary image (reset all to false, then set one)
export const setPrimaryImage = async (turf_id, image_id) => {
    await pool.query(`UPDATE turf_images SET is_primary = 0 WHERE turf_id = ?`, [turf_id])
    await pool.query(`UPDATE turf_images SET is_primary = 1 WHERE id = ? AND turf_id = ?`, [image_id, turf_id])
}
