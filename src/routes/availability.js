const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const availabilityController = require("../controllers/availabilityController");

// Add availability
router.post("/", auth, availabilityController.createAvailability);

// View availability by professor
router.get("/:professorId", auth, availabilityController.viewAvailability);

module.exports = router;