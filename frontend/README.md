# TurfBook Frontend

A full-stack turf booking platform built with React + Tailwind CSS.

## Tech Stack
- React 18 + Vite
- Tailwind CSS v3
- React Router v6
- Axios (API calls)
- react-hot-toast (notifications)
- lucide-react (icons)
- date-fns (date formatting)

## Pages
| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Browse Turfs | `/turfs` | Public |
| Turf Detail | `/turfs/:id` | Public |
| Login | `/login` | Guest only |
| Register | `/register` | Guest only |
| Book Slots | `/book/:turfId` | Client only |
| My Bookings | `/bookings` | Client only |
| Owner Dashboard | `/owner/dashboard` | Owner only |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Runs on http://localhost:3000

### 3. Make sure backend is running on port 5000
The Vite config proxies `/api` requests to `http://localhost:5000`

## Backend API expected at
```
http://localhost:5000/api
```

## Important Notes

### Backend turf routes need these updates:
- `GET /api/turfs` should return turf with its sports array
- `POST /api/turfs` should accept `sports` array and create turf_sports rows
- `GET /api/turfs/:id` should return turf with owner_name and sports array

### Backend turf model — add this query to fetch with sports:
```js
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
```

### Also add createTurf with sports to turf.model.js:
```js
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
```

### Add to turf.controller.js:
```js
export const createTurf = async (req, res) => {
  try {
    const turf = await TurfModel.createTurf(req.user.id, req.body)
    res.status(201).json({ message: 'Turf created', turf_id: turf.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong' })
  }
}
```

### Add to turf.routes.js:
```js
router.post('/', verifyToken, checkRole('owner'), createTurf)
```

## Build for production
```bash
npm run build
```
