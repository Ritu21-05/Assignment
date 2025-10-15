const mongoose = require("mongoose");
const User = require("../models/User");

const availabilitySchema = new mongoose.Schema({
   professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   date: { type: Date, required: true },             
  
   slots: [
    {
      time: { type: String, required: true },
      isBooked: { type: Boolean, required: true, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Availability", availabilitySchema);