const dotenv = require("dotenv");
const sendMail = require("../helpers/sendMail");
const Expense = require("../models/Expense");

dotenv.config();

const expenseEmail = async () => {
  const expense = await Expense.find();

  const totalExpense = expense.reduse((acc, expense) => acc + expense.value, 0);

  if (totalExpense > 10000) {
    let messageOption = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "warning",
      text: `your total expense is ${totalExpense}`,
    };

    await sendMail(messageOption);
  }
};

module.exports = expenseEmail;
