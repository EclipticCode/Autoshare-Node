const {  RegistrationModel , BookingModel } = require("./schema");
const { ObjectId } = require('mongodb')


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

// Registration
const handleRegistration = async (apiReq, apiRes) => {
 
const { username , password , phoneNumber , emailAddress } = apiReq.body.values;

if(
    username?.length && 
    password?.length && 
    phoneNumber?.length &&  
    emailAddress?.length 
) {
   const dbResponse = await RegistrationModel.create({
        username : username ,
        password : password ,
        phoneNumber : phoneNumber , 
        emailAddress : emailAddress
    })
    if(dbResponse){
        apiRes.send(dbResponse)
        return;
    }
}
apiRes.send("Fill in all fields")
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
   apiRes.send("Cancelled Failed")
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
