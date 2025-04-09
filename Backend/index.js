const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const expenseRoute = require("./routes/expense");

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-name.onrender.com", // <-- Replace with your actual frontend URL
    ],
  })
);

app.use("/expenses", expenseRoute);

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("mongodb connect"))
  .catch((err) => console.error("mongoose error:", err));

app.listen(process.env.PORT, () => {
  console.log(`server is runnig on PORT ${process.env.PORT}`);
});
