const express = require("express");
const authRouters = express.Router();
const authController = require("../controllers/authController");

authRouters.get("/login", authController.getLogin);
authRouters.post("/login", authController.postLogin);

authRouters.get("/isLoggedIn", authController.checkLoginStatus);
authRouters.post("/logout", authController.postLogout);
authRouters.get("/signup", authController.getSignup);
authRouters.post("/signup", authController.postSignup); // ✅ add this

module.exports = authRouters;
