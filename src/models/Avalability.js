const { timeStamp } = require("console");
const mongoose=require("mongoose");
const { ref } = require("process");

const availabilitySchema=new mongoose.Schema({
    professor:{type:mongoose.Types.ObjectId,ref:User,required:true},
    slots:[
        {
        time:{type:String,required:true},
        isBooked:{type:Boolean,required:true,default:false}
       },
    ],

});

module.exports=mongoose.models("Availability",availabilitySchema);   