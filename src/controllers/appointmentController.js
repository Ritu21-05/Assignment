const mongoose = require("mongoose");
const User = require("../models/User");
const Availability = require("../models/Avalability");
const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
  try {
  const { availabilityId, date, slot } = req.body;
    const studentId = req.user._id;
    
    const availability = await Availability.findById(availabilityId).populate("professor");
    console.log(availability)
    if (!availability) {
      return res.status(404).json({ msg: "Availability not found" });
    }

    
    const availabilityDate = availability.date.toISOString().split("T")[0];
    if (availabilityDate !== date) {
      return res.status(400).json({ msg: "Date mismatch with availability" });
    }
    

    
    const requestedTime = slot && typeof slot === "object" ? slot.time : slot;
    const Slot = availability.slots.find((s) => s.time === requestedTime && !s.isBooked);
    // debug
    availability.slots.forEach((s) => console.log(`'${s.time},'${requestedTime},'${s.isBooked}'`));
    if (!Slot) {
      return res.status(404).json({ msg: "Slot not available" });
    }

    
    const appointment = new Appointment({
      student: studentId,
      professor: availability.professor._id,
      slot: Slot.time,
      date: availability.date instanceof Date ? availability.date.toISOString().split("T")[0] : String(availability.date),
      status: "booked",
    });

    
    await appointment.save();

    
    Slot.isBooked = true;
    try {
        await availability.save();
       } catch (saveErr) {
   
    await Appointment.findByIdAndDelete(appointment._id).catch(() => {});
    throw saveErr;
}

    
    res.status(201).json({ msg: "Appointment booked successfully", appointment });

  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ msg: err.message });
  }
};


exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });
    // Only professor who owns the appointment can cancel here
    const professorId = appointment.professor.toString();
    const requesterId = String(req.user._id || req.user.id);
    if (req.user.role !== "professor" || professorId !== requesterId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Normalize slot time (appointment.slot may be an object {time: '10:00'} or a string)
    const slotTime = typeof appointment.slot === "string"
      ? appointment.slot
      : (appointment.slot && appointment.slot.time) || "";

    // Appointment.date is stored as a string 'YYYY-MM-DD' in this project.
    // Availability.date is a Date. Match by day using a range [start, end).
    const start = new Date(appointment.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const availUpdate = await Availability.findOneAndUpdate(
      { professor: appointment.professor, date: { $gte: start, $lt: end } },
      { $set: { "slots.$[elem].isBooked": false } },
      { arrayFilters: [{ "elem.time": slotTime }], new: true }
    );

    // It's okay if availability wasn't found (maybe it was removed) - continue to delete appointment
    await appointment.deleteOne();
    return res.status(200).json({ msg: "Appointment cancelled successfully", availability: availUpdate });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .populate("professor", "name email");
      
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};