const express = require("express");

const router = express.Router();
const Express = require("../models/Expense");
const Expense = require("../models/Expense");

router.post("/", async (req, res) => {
  try {
    const newExpense = await Expense(req.body);
    const expense = newExpense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(201).json("delete successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
