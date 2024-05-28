const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const {connectDb , mongoose} = require('./db')
const {handleLogin , handleRegistration , handleCreateBooking , handleMyBookings , handleCancelBooking } = require('./service')

app.use(cors());
app.use(bodyParser.json())

connectDb();

app.get('/login/:username/:password' , (apiReq,apiRes) => {
    handleLogin(apiReq,apiRes);
})

app.post('/registration' , (apiReq , apiRes) => {
    handleRegistration(apiReq , apiRes)
})

app.post('/createBooking',  (apiReq , apiRes) => {
    handleCreateBooking(apiReq , apiRes)
})

app.get('/mybookings/:username',  (apiReq , apiRes) => {
    handleMyBookings(apiReq , apiRes)
})

app.put('/cancelBooking/:username/:bookingId' , (apiReq , apiRes) => {
    handleCancelBooking(apiReq , apiRes)
})

// app.get('/bookedSlots/:id/:selectedEndDate' , (apiReq , apiRes) => {
//     handleBookedSlots(apiReq , apiRes)
// })

app.get('/', (req,res)=> {
   if(mongoose.connection.readyState === 1) {
    res.send("Server working and connected to DB");
    return;
   }
   res.send("Server working fine")
})

app.listen(4000 , ()=> {
    console.log("Server started at 4000")
})