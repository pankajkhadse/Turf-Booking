import express from 'express'
import {profile} from '../controllers/user.controller.js'
import {update} from '../controllers/user.controller.js'



const router = express.Router()
router.get('/profile/:id',profile)
router.patch('/update/:id',update)

export default router