const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.postSignup = async (req, res) => {
  console.log("📩 Signup endpoint hit");
  const { username, password } = req.body;
  console.log("Received signup:", username, password);

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ Username exists:", username);
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed password:", hashedPassword);

    const newUser = new User({ username, password: hashedPassword });
    const saved = await newUser.save();

    console.log("✅ User saved:", saved);

    // Set session data
    req.session.isLoggedIn = true;
    req.session.userId = saved._id;

    // Save session explicitly to ensure persistence before responding
    req.session.save((err) => {
      if (err) {
        console.error("Session save error after signup:", err);
        return res.status(500).json({ message: "Session save error" });
      }
      res.status(201).json({ message: "Signup successful" });
    });
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

exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;
  console.log("👉 Login attempt:", username, password);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ No such user");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set session data
    req.session.isLoggedIn = true;
    req.session.userId = user._id;

    // Save session explicitly to ensure persistence before responding
    req.session.save((err) => {
      if (err) {
        console.error("Session save error after login:", err);
        return res.status(500).json({ message: "Session save error" });
      }
      console.log("✅ Login successful");
      res.status(200).json({ message: "Login successful" });
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkLoginStatus = (req, res) => {
  if (req.session && req.session.isLoggedIn) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "Signup",
    isLoggedIn: false,
  });
};
