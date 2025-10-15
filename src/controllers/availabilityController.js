const Availability = require("../models/Avalability");

function parseDateInput(input) {
  // Accept YYYY-MM-DD or DD/MM/YYYY
  if (!input) return null;
  // ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return new Date(input);
  // DD/MM/YYYY
  const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [_, dd, mm, yyyy] = m;
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  return null;
}

exports.createAvailability = async (req, res) => {
  try {
    const { professor, date, slots } = req.body;
    const parsed = parseDateInput(date || (req.body && req.body.date));
    if (!parsed || isNaN(parsed.getTime())) {
      return res.status(400).json({ msg: "Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY" });
    }
    const avail = new Availability({ professor, date: parsed, slots });
    await avail.save();
    res.status(201).json(avail);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.viewAvailability = async (req, res) => {
  try {
    const { professorId } = req.params;
    const avails = await Availability.find({ professor: professorId });
    if (!avails || avails.length === 0) return res.status(404).json({ msg: "No availability found" });
    res.json(avails);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};