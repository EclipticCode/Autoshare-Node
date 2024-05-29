const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
  username: { type: String },
  password: { type: String },
  phoneNumber: { type: String },
  emailAddress: { type: String },
});

const BookingSchema = new Schema({
  username: { type: String },
  carId: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  deliveryTime: { type: String },
  isCancelled  : { type : Boolean }
});

const RegistrationModel = mongoose.model("registrations", RegistrationSchema);
const BookingModel = mongoose.model("bookings" , BookingSchema)


module.exports = {
  RegistrationModel,
  BookingModel
};
