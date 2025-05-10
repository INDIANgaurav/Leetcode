const express = require("express");
const authRouter = express.Router();

//register
authRouter.post("/register" , register)
authRouter.post("/login" , login)
authRouter.post("/logout" , logout)
authRouter.post("/getProfile" , getProfile)


