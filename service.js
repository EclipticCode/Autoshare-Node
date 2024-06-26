const {  RegistrationModel , BookingModel } = require("./schema");
const { ObjectId } = require('mongodb')
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')


const jwtUserkey = process.env.JWT_USERKEY;

// Registration
const handleRegistration = async (apiReq, apiRes) => {
try {
    const { username , password , phoneNumber , emailAddress } = apiReq.body.values;
    if( username &&  password && phoneNumber && emailAddress) {
       const hashedPassword = await bcrypt.hash(password , 0)
       const dbResponse = await RegistrationModel.create({
            username : username ,
            password : hashedPassword ,
            phoneNumber : phoneNumber , 
            emailAddress : emailAddress
        })
        apiRes.json({message:"Data added"})
     }
    }
    catch(error){
        console.error("Error during registration:" , error);
        apiRes.status(500).send("Internal server error")
    }
}



// Login
const handleLogin =  async (apiReq, apiRes) => {
    try{
        const { username } = apiReq.params
        const password  = apiReq.params.password

    const dbResponse = await RegistrationModel.findOne({
        username : username 
    })
   if(dbResponse?.username){
    const passwordMatch = await bcrypt.compare(password , dbResponse.password)
    if(passwordMatch){
    const token = jwt.sign({data : username } , jwtUserkey);
    apiRes.json({username : dbResponse.username , token : token})
    return
   }}
   apiRes.send("Login failed")
    }
    catch(error){
        console.error("Error during login")
        apiRes.send("Login failed")
    }
};


// Booking

const handleCreateBooking = async (apiReq , apiRes) => {

const { username , id , startDate , endDate , deliveryTime } = apiReq.body;

if(
    username?.length &&
    id?.length && 
    startDate?.length && 
    endDate?.length && 
    deliveryTime?.length 
){
    const dbResponse =  await BookingModel.create({
        username , carId : id , startDate , endDate , deliveryTime , isCancelled : false , 
    })
    if(dbResponse?._id){
        apiRes.send(dbResponse)
    }
    return;
}
apiRes.send("Invalid data for booking")
}

// myBookings
const handleMyBookings = async (apiReq , apiRes) => {
  try {
    const {username} = apiReq.params;

    if(username?.length){
     const dbResponse = await  BookingModel.find({
         username
     });
     if(dbResponse){
         apiRes.send(dbResponse);
         return;
     }
    }
    apiRes.send("Can't fetch details")
  } catch(error){
    console.error("Error fetching bookings")
    apiRes.send("Internal server error")
  }
}

// cancel booking
const handleCancelBooking = async (apiReq , apiRes) => {
   const {username , bookingId} = apiReq.params;

   if(username?.length && bookingId?.length){
    const filter = { _id : new ObjectId(bookingId)};
    const update = {isCancelled : true};
    const dbResponse = await BookingModel.findOneAndUpdate(filter , update);

    if(dbResponse){
        apiRes.send("Booking cancelled successfully");
        return;
    }
   }
   apiRes.send("Cancellation Failed")
}

// bookedCars
const handleBookedCars = async (apiReq , apiRes) => {
   
  try{
    const bookings = await BookingModel.find()
    const bookedCarIds = bookings.map(booking => booking.carId)
    apiRes.json(bookedCarIds);
  } 
  catch(error){
    console.error("Error fetching booked cars")
    apiRes.status(500).json({error: "Internal server error"})
  }
}


module.exports = {
  handleLogin,
  handleRegistration,
  handleCreateBooking,
  handleMyBookings ,
  handleCancelBooking ,
  handleBookedCars
};
