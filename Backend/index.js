const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoDBStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const DB_CONNECTION = process.env.DB_CONNECTION;

const store = new mongoDBStore({
  uri: DB_CONNECTION,
  collection: "sessions",
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://frontend-vzpf.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("trust proxy", 1); // Important when using HTTPS behind proxy (like Render.com)

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: true, // true for HTTPS
      sameSite: "none", // important for cross-origin cookies
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Define the auth middleware here
const isAuth = (req, res, next) => {
  if (req.session?.isLoggedIn) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Dummy routes for demonstration
// Replace with your real route files
app.get("/expenses", isAuth, (req, res) => {
  res.json({ expenses: [{ label: "Coffee", value: 3, date: "2025-06-01" }] });
});

app.post("/login", (req, res) => {
  // You should verify username and password here
  // For demo, let's just accept anything and mark session loggedIn
  req.session.isLoggedIn = true;
  req.session.save(() => {
    res.json({ message: "Logged in successfully" });
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

mongoose
  .connect(DB_CONNECTION)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
