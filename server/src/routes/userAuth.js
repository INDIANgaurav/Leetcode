const express = require("express");
const authRouter = express.Router();
const { register, login, logout, adminRegister, deleteProfile } = require("../controllers/userAuthenticate");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware  = require("../middleware/adminMiddleware");

//register
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware , adminRegister);
authRouter.delete("/deleteProfile" , userMiddleware , deleteProfile    )
// authRouter.post("/getProfile" , getProfile)

module.exports = authRouter;
