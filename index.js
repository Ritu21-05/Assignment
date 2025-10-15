const express=require("express");
const connectDB=require("./src/config/db")
require('dotenv').config();

const app=express();
app.use(express.json());

app.use("/api/auth",require("./src/routes/auth"));
app.use("/api/availability", require("./src/routes/availability"));
app.use("/api/appointments", require("./src/routes/appointment"));


connectDB();

if (process.env.NODE_ENV !== 'test') {
  app.listen(8000, () => console.log('Port running at 8000'));
}
app.get('/',(req,res)=>{
    console.log("Hello world");
});
module.exports=app;