const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const expenseRoutes = require("./routes/expenses");
require("dotenv").config();

const app = express();
const DB_CONNECTION = process.env.DB_CONNECTION;
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://frontend-vzpf.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const store = new MongoDBStore({
  uri: DB_CONNECTION,
  collection: "sessions",
});

app.set("trust proxy", 1);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.post("/login", (req, res) => {
  req.session.isLoggedIn = true;
  req.session.userId = "demoUserId";
  req.session.save((err) => {
    if (err) return res.status(500).json({ message: "Login failed" });
    res.json({ message: "Logged in successfully" });
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

app.use("/", expenseRoutes);

mongoose
  .connect(DB_CONNECTION)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server running on port", PORT));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
