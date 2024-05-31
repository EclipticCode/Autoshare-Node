const mongoose = require ('mongoose');

const mongoDbUrl = process.env.MONGO_DB_URL;

const connectDb = async () => {
   if(mongoose.connection.readyState === 1)
   return; 
   await mongoose.connect(mongoDbUrl);

   console.log(mongoose.connection.readyState , "--- Connection State")
}

module.exports = {
    connectDb,
    mongoose
}