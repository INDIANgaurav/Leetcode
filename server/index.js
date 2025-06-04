const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { main } = require("./src/config/db");
const authRouter = require("./src/routes/userAuth");
const redisClient = require("./src/config/redis");
const problemRouter = require("./src/routes/problemCreator")
const submitRouter = require("./src/routes/submit")
app.use(express.json());
app.use(cookieParser());
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
const InitializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("Redis Db Connected");
    app.listen(process.env.PORT, () => {
      console.log("server is listening on port " + process.env.PORT);
    });
  } catch (error) {
    console.log("error" + error);
  }
};

InitializeConnection();
