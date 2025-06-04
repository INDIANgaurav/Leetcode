const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not present");
    }
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;
    if (!_id) {
      throw new Error("Invalid token");
    }
    const result = await User.findById(_id);
    if (!result) {
      throw new Error("User doesn't Exist");
    }

    // redis ke block list me present to nahi hai agar hai to aage badhne ki permission nahi deni hai

    const IsBlocked = await redisClient.exists(`token:${token}`);

    if (IsBlocked) {
      throw new Error("Invalid Token");
    }
    req.result = result;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = userMiddleware 
