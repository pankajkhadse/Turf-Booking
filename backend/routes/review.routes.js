import express from 'express'
import { addReview, getTurfReviews } from '../controllers/review.controller.js'
import  verifyToken  from '../middlewares/checkLogin.js'

const router = express.Router()

router.post('/',verifyToken, addReview)
router.get('/turf/:turf_id',  getTurfReviews)   // public

export default router