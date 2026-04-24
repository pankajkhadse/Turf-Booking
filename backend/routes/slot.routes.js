import express from 'express'
import { generate, getAvailability, bookSlot } from '../controllers/slot.controller.js'
import  checkLogin  from '../middlewares/checkLogin.js'

const router = express.Router()

router.post('/generate',checkLogin, generate)      // owner only
router.get('/availability',getAvailability)            // public
router.post('/book',checkLogin, bookSlot)      // client only

export default router