import authRoutes from './routes/auth.routes.js' 
import userRoutes from './routes/user.routes.js'
import turfRoute from './routes/turf.routes.js'
import slotRoutes from './routes/slot.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import reviewRoutes  from './routes/review.routes.js'

import express  from 'express';
import verifyToken  from './middlewares/checkLogin.js'
import cors from 'cors';
// import db  from "./config/db.js";
const app = express()
// Option A: Allow only your frontend (Recommended for security)
const corsOptions = {
    origin: ['http://localhost:3000'], //,'http://192.168.31.90:3000'
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
const port = 5000;
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/v1/api/auth', authRoutes)
app.use('/v1/api/user',verifyToken ,userRoutes)
app.use('/v1/api/turf',turfRoute)
app.use('/v1/api/slots', slotRoutes) 
app.use('/v1/api/bookings', bookingRoutes)
app.use('/v1/api/payments', paymentRoutes)
app.use('/v1/api/reviews',  reviewRoutes)

app.get('/',(req,res)=>{
    res.json({
       msg:`runnig on the port ${port}`
    })
})

app.listen(port,(req, res)=>{`server listening on port ${port}`

})
