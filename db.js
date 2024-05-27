const mongoose = require ('mongoose');

const mongoDbUrl = "mongodb+srv://jananib6:Janani2000@cluster0.4h2ombp.mongodb.net/AutoShare"

const connectDb = async () => {
   if(mongoose.connection.readyState === 1) return; 
   await mongoose.connect(mongoDbUrl);

   console.log(mongoose.connection.readyState , "--- Connection State")
}

module.exports = {
    connectDb,
    mongoose
}