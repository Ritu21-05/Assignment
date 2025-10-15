
const express = require("express");
const router = express.Router();
const { bookAppointment,cancelAppointment,viewAppointments } = require("../controllers/appointmentController");
const auth = require("../middleware/auth");

router.post("/book", auth, bookAppointment);
router.delete("/:appointmentId", auth,cancelAppointment);
router.get("/student", auth,viewAppointments);




module.exports = router;
