const {  RegistrationModel , BookingModel } = require("./schema");
const { ObjectId } = require('mongodb')
const bcrypt = require ('bcryptjs')

// Registration
const handleRegistration = async (apiReq, apiRes) => {
try {
    const { username , password ,confirmPassword, phoneNumber , emailAddress } = apiReq.body.values;
    
    // if(password !== confirmPassword){
    //     return apiRes.status(400).json({message : "Passwords do not match"})
    //     alert("Passwords do not match")
    // }
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

    const {username , password} = apiReq.params
    
    const dbResponse = await RegistrationModel.findOne({
        username : username ,
        password : password
    })
   if(dbResponse?._id){
    apiRes.send(dbResponse.username)
    return
   }
   apiRes.send("Login failed")
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

// booked Slots 
// const handleBookedSlots = async (apiReq , apiRes) => {
   
//     const { id , selectedEndDate } = apiReq.params;

//     const dbResponse = await BookingModel.find({
//         carId : id , endDate : selectedEndDate ,
//     });
//     if(dbResponse?.length){
//         apiRes.send(dbResponse)
//     }
// }


module.exports = {
  handleLogin,
  handleRegistration,
  handleCreateBooking,
  handleMyBookings ,
  handleCancelBooking ,
//   handleBookedSlots
};
