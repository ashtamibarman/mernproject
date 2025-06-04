const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// 🔐 OPTIONAL: replace with real auth middleware if needed
const isAuth = (req, res, next) => {
  // Skip auth for now — assume always logged in
  next();
};

// GET all expenses
router.get("/expenses", isAuth, async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.json({ expenses });
  } catch (err) {
    console.error("GET /expenses error:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST new expense
router.post("/expenses", isAuth, async (req, res) => {
  try {
    const { label, value, date } = req.body;

    if (!label || !value || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newExpense = new Expense({ label, value, date });
    await newExpense.save();

    res.status(201).json({ message: "Expense added", expense: newExpense });
  } catch (err) {
    console.error("POST /expenses error:", err);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// PUT update expense
router.put("/expenses/:id", isAuth, async (req, res) => {
  try {
    const { label, value, date } = req.body;
    const { id } = req.params;

    const updated = await Expense.findByIdAndUpdate(
      id,
      { label, value, date },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Expense not found" });

    res.json({ message: "Expense updated", expense: updated });
  } catch (err) {
    console.error("PUT /expenses/:id error:", err);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// DELETE expense
router.delete("/expenses/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Expense not found" });

    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("DELETE /expenses/:id error:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
