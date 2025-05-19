const mongoose = require("mongoose");

const main = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    if (connection.STATES.connected) {
      console.log("database connected");
    }
    if (connection.STATES.disconnected) {
      console.log("database disconnected");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {main};