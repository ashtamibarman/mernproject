const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoDBStore = require("connect-mongodb-session")(session);
const DB_CONNECTION =
  "mongodb+srv://ashi:ashi@cluster0.7i1hf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dotenv = require("dotenv");
const path = require("path");
const app = express();

const expenseRoute = require("./routes/expense");
const authRouters = require("./routes/authRouter");

dotenv.config();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = new mongoDBStore({
  url: DB_CONNECTION,
  collection: "sessions",
});

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "connect.sid",
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // 🔴 false for development (no https)
      httpOnly: true,
      sameSite: "lax",
      store,
    },
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-project-5r8l.onrender.com"],
    credentials: true,
  })
);

app.use("/expenses", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    node;
    res.redirect("/login");
  }
});

app.use("/expenses", expenseRoute);
app.use(authRouters);
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("mongodb connect"))
  .catch((err) => console.error("mongoose error:", err));

app.listen(process.env.PORT, () => {
  console.log(`server is runnig on PORT ${process.env.PORT}`);
});
