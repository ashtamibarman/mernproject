const bcrypt = require("bcryptjs");

const User = require("../models/User");

exports.postSignup = async (req, res) => {
  console.log("Signup endpoint hit");
  const { username, password } = req.body;
  console.log("Received signup:", username);

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Username exists:", username);
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    const saved = await newUser.save();

    console.log("✅ User saved:", saved);

    req.session.isLoggedIn = true;
    req.session.userId = saved._id;

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
  });
};

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "123") {
    res.cookie("isLoggedIn", true);
    return res.status(200).json({ message: "login successful" });
  }
  res.status(401).json({ message: "invaild credentials" });
};

exports.checkLoginStatus = (req, res) => {
  // ✅ Check if session exists first
  if (req.session && req.session.isLoggedIn) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
};

exports.postLogout = (req, res, next) => {
  res.clearCookie("isLoggedIn"); // or set to false
  res.status(200).json({ message: "Logged out" });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "Signup",
    isLoggedIn: "false",
  });
};
