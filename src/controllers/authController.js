const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashPassword, role });
    await user.save();

    const token = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password} = req.body;

    const  user = await User.findOne({email});
    if(!user) return res.status(400).json({msg: "Invalid Credential"});

    const isMatched = await bcrypt.compare(password, user.password);
     if (!isMatched) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });


  }catch (err) {
    res.status(500).json({ msg: err.message });
  }
  
}; 
