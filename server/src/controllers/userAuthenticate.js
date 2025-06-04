const redisClient = require("../config/redis");
const Submission = require("../models/Submission");
const User = require("../models/User");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";
    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId, role: "user" },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("User registered successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ error: "User not registered" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("Logged in successfully");
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "Blocked Token");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    //token add krana hai redis ke blocklist me
    // cookies ko clear kr denge

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged out successfully");
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

const adminRegister = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("admin registered successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    await User.findByIdAndDelete(userId);
    await Submission.deleteMany({ userId });
    return res.status(200).send("Deleted SuccessFully");
  } catch (error) {
    return res.status(500).send("server error");
  }
};
module.exports = { register, login, logout, adminRegister, deleteProfile };
