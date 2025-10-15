const { timeStamp } = require("console");
const mongoose=require("mongoose");

const appointmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // store slot as a plain string (e.g. "10:00") to avoid schema cast issues
  slot: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" }
}, { timestamps: true });

module.exports=mongoose.model("Appointment",appointmentSchema);