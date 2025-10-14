const mongoose=require("mongoose");

const connectDB=async()=>{
   await mongoose.connection(process.env.MONGO_URI);
   console.log("DB connected");
};

module.exports=connectDB;