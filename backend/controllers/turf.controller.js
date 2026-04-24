
// import { createTurf,getAllTurfs, getTurfById, updateTurf, deleteTurf,getTurfImages,setPrimaryImage } from '../models/turf.model.js'
import {
    createTurf, getAllTurfs, getTurfById, updateTurf, deleteTurf,
    getTurfImages, getTurfImageCount, insertTurfImage,
    getTurfImageById, deleteTurfImage, setPrimaryImage
} from '../models/turf.model.js'
import { cloudinary, uploadTurfPhotos } from '../config/cloudinary.js'
export const turf = async (req, res) => {
  try {
    const turf = await createTurf(req.user.id, req.body)
    res.status(201).json({ message: 'Turf created', turf_id: turf.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong' })
  }
}




// LIST all turfs
export const listTurfs = async (req, res) => {
    try {
        const turfs = await getAllTurfs()
        res.status(200).json({
            message: 'Turfs fetched successfully',
            count: turfs.length,
            turfs
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// UPDATE turf
export const editTurf = async (req, res) => {
    const { id } = req.params
    const { name, city, address, price_per_hour, status } = req.body

    try {
        // 1. check if turf exists
        const turf = await getTurfById(id)
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' })
        }

        // 2. check if the logged in owner actually owns this turf
        if (turf.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not own this turf' })
        }

        // 3. update it
        await updateTurf(id, { name, city, address, price_per_hour, status })

        res.status(200).json({ message: 'Turf updated successfully' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// DELETE turf
export const removeTurf = async (req, res) => {
    const { id } = req.params

    try {
        // 1. check if turf exists
        const turf = await getTurfById(id)
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' })
        }

        // 2. only the owner or admin can delete
        if (turf.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not own this turf' })
        }

        // 3. delete it
        await deleteTurf(id)

        res.status(200).json({ message: 'Turf deleted successfully' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// GET a single turf by ID
export const getTurf = async (req, res) => {
    const { id } = req.params;

    try {
        const turf = await getTurfById(id);

        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' });
        }

        res.status(200).json({
            message: 'Turf fetched successfully',
            turf
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


// UPLOAD photos — max 4 per turf
export const uploadPhotos = (req, res) => {
    uploadTurfPhotos(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload failed' })
        }

        const { id } = req.params

        try {
            // verify turf ownership
            const t = await getTurfById(id)
            if (!t) return res.status(404).json({ message: 'Turf not found' })
            if (Number(t.owner_id) !== Number(req.user.id))
                return res.status(403).json({ message: 'You do not own this turf' })

            if (!req.files || req.files.length === 0)
                return res.status(400).json({ message: 'No files uploaded' })

            // check current count
            const currentCount = await getTurfImageCount(id)
            const remaining    = 4 - currentCount

            if (remaining <= 0)
                return res.status(400).json({ message: 'Maximum 4 photos allowed per turf' })

            if (req.files.length > remaining)
                return res.status(400).json({
                    message: `You can only add ${remaining} more photo${remaining > 1 ? 's' : ''}`
                })

            // insert each uploaded image
            const saved = []
            for (let i = 0; i < req.files.length; i++) {
                const file      = req.files[i]
                const isPrimary = currentCount === 0 && i === 0  // first ever photo = primary
                const record    = await insertTurfImage(id, file.path, file.filename, isPrimary)
                saved.push({ id: record.id, image_url: file.path, is_primary: isPrimary })
            }

            res.status(201).json({
                message: `${saved.length} photo${saved.length > 1 ? 's' : ''} uploaded successfully`,
                photos: saved,
                total:  Number(currentCount) + saved.length
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'Something went wrong' })
        }
    })
}

// GET all photos for a turf
export const getPhotos = async (req, res) => {
    const { id } = req.params
    try {
        const images = await getTurfImages(id)
        res.status(200).json({ photos: images, total: images.length })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// DELETE a photo
export const deletePhoto = async (req, res) => {
    const { id, photo_id } = req.params
    try {
        const t = await getTurfById(id)
        if (!t) return res.status(404).json({ message: 'Turf not found' })
        if (Number(t.owner_id) !== Number(req.user.id))
            return res.status(403).json({ message: 'You do not own this turf' })

        const photo = await getTurfImageById(photo_id)
        if (!photo || Number(photo.turf_id) !== Number(id))
            return res.status(404).json({ message: 'Photo not found' })

        // delete from cloudinary
        if (photo.public_id) {
            await cloudinary.uploader.destroy(photo.public_id)
        }

        // delete from DB
        await deleteTurfImage(photo_id)

        // if deleted photo was primary, make the next one primary
        if (photo.is_primary) {
            const remaining = await getTurfImages(id)
            if (remaining.length > 0) {
                await setPrimaryImage(id, remaining[0].id)
            }
        }

        res.status(200).json({ message: 'Photo deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// SET a photo as primary
export const makePrimary = async (req, res) => {
    const { id, photo_id } = req.params
    try {
        const t = await getTurfById(id)
        if (!t) return res.status(404).json({ message: 'Turf not found' })
        if (Number(t.owner_id) !== Number(req.user.id))
            return res.status(403).json({ message: 'You do not own this turf' })

        await setPrimaryImage(id, photo_id)
        res.status(200).json({ message: 'Primary photo updated' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}
