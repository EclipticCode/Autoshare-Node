const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken')
const {  RegistrationModel } = require("./schema");

const {connectDb , mongoose} = require('./db')
const {handleLogin , handleRegistration , handleCreateBooking , handleMyBookings , handleCancelBooking } = require('./service')

app.use(cors());
app.use(bodyParser.json())
connectDb();

const jwtUserkey = process.env.JWT_USERKEY;

app.get('/', (req,res)=> {
    if(mongoose.connection.readyState === 1) {
     res.send("Server working and connected to DB");
     return;
    }
    res.send("Server working fine")
 })

 
app.get('/login/:username/:password' , (apiReq,apiRes) => {
    handleLogin(apiReq,apiRes);
})

app.post('/registration' , (apiReq , apiRes) => {
    handleRegistration(apiReq , apiRes)
})


const verifyUser = async (username) => {
   const dbResponse = await RegistrationModel.findOne({username})
   if(dbResponse._id){
    return true;
   }
   return false;
}

const auth = (req, res, next) => {
    if(req.headers.auth){
      const userToken = req.headers.auth;
     try{
        const tokenDecoded = jwt.verify(userToken , jwtUserkey)
        const username = tokenDecoded.data;
        verifyUser(username)
        .then(response =>{ 
            if(response){
                next();
            }
        else{
            res.send(400)
        }}
        )
     } catch(error){
        res.status(400).send("Invalid token");
     }
    } else {  
    res.status(400).send("API error");
    return;
}
};


app.post('/createBooking', auth , (apiReq , apiRes) => {
    handleCreateBooking(apiReq , apiRes)
})

app.get('/mybookings/:username', auth , (apiReq , apiRes) => {
    handleMyBookings(apiReq , apiRes)
})

app.put('/cancelBooking/:username/:bookingId' , auth , (apiReq , apiRes) => {
    handleCancelBooking(apiReq , apiRes)
})

// app.get('/bookedSlots/:id/:selectedEndDate' , (apiReq , apiRes) => {
//     handleBookedSlots(apiReq , apiRes)
// })


app.listen(4000 , ()=> {
    console.log("Server started at 4000")
})