import express from 'express'
import checkLogin from '../middlewares/checkLogin.js'
import {checkRole} from '../middlewares/auth.middleware.js'
import { listTurfs, editTurf, removeTurf ,getTurf,uploadPhotos,getPhotos,deletePhoto,makePrimary} from '../controllers/turf.controller.js'
import {turf} from '../controllers/turf.controller.js'

const router = express.Router()


router.post('/', checkLogin, checkRole('owner'), turf)
router.get('/',listTurfs)
router.get('/:id', getTurf)
router.put('/:id',checkLogin, editTurf) 
 
router.delete('/:id',checkLogin, removeTurf)

// photo routes — all owner only
router.post('/:id/photos',              checkLogin, checkRole('owner'), uploadPhotos)
router.get('/:id/photos',              getPhotos)       // public — anyone can see photos
router.delete('/:id/photos/:photo_id', checkLogin, checkRole('owner'), deletePhoto)
router.patch('/:id/photos/:photo_id/primary', checkLogin, checkRole('owner'), makePrimary)

 export default router;