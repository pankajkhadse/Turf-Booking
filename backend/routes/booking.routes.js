import express from 'express'
import { getHistory, getBooking, cancelBooking ,getTurfBookings,getTurfOccupancy,getTurfDashboardStats } from '../controllers/booking.controller.js'
import  verifyToken  from '../middlewares/checkLogin.js'
import { checkRole } from '../middlewares/auth.middleware.js'

const router = express.Router()


// owner routes — new
router.get('/turf/:turf_id',            verifyToken, checkRole('owner'), getTurfBookings)
router.get('/turf/:turf_id/occupancy',  verifyToken, checkRole('owner'), getTurfOccupancy)
router.get('/turf/:turf_id/stats',      verifyToken, checkRole('owner'), getTurfDashboardStats)

router.get('/history',    verifyToken, checkRole('client'), getHistory)
router.get('/:id',        verifyToken, checkRole('client'), getBooking)
router.patch('/cancel/:id', verifyToken, checkRole('client'), cancelBooking)

export default router