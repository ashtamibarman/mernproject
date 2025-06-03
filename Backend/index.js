const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoDBStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// MongoDB connection string
const DB_CONNECTION = process.env.DB_CONNECTION;

// Session store
const store = new mongoDBStore({
  uri: DB_CONNECTION,
  collection: "sessions",
});

// CORS setup BEFORE any routes
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies/session
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: true, // because you're on HTTPS (Render)
      sameSite: "none", // required for cross-origin cookies
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Set EJS engine (optional)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Custom middleware to track login
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  console.log("📦 Body:", req.body);
  next();
});

// Auth & expense routes
const expenseRoute = require("./routes/expense");
const authRouters = require("./routes/authRouter");

app.get("/expenses", (req, res) => {
  console.log("🔍 SESSION:", req.session);
  if (!req.session?.isLoggedIn) {
    console.log("❌ Unauthorized: No session");
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.use("/expenses", expenseRoute);
app.use(authRouters);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
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
