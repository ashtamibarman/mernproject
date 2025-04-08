const express = require("express");
const cron = require("node-cron");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const expenseEmail = require("./EmailService/Expense");

dotenv.config();

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("DB connection is successfull");
  })
  .catch((err) => {
    console.log(err);
  });

const run = () => {
  cron.schedule("* * * * *", () => {
    console.log("running a task every minutes");
    expenseEmail();
  });
};

//run();

app.listen(process.env.PORT, () => {
  console.log(`server is runnig on port ${process.env.PORT}`);
});
