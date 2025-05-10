const User = require("../models/User");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("User register successfully");
  } catch (error) {
    res.status(400).send("Error: ", error);
  }
};
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId) {
      throw new Error("Invalid credentials");
    }
    if (!password) {
      throw new Error("Invalid Credentials");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      res.send("User not registered");
    }
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("loggedin successfully");
  } catch (error) {
    res.status(401).send("error", error);
  }
};

const logout = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}
