import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import {
  splitEqually,
  splitByPercentage,
  calculateBalances,
  simplifyDebts,
} from "../utils/Splitcalculator.js";

// POST /api/expenses
export const addExpense = async (req, res) => {
  try {
    const { groupId, description, amount, splitType, customSplits, percentages } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some((m) => m.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: "Not a member of this group" });

    let splits;
    if (splitType === "custom") {
      // Expect frontend to send: [{ user: id, amount: 100 }, ...]
      splits = customSplits;
      const sum = splits.reduce((s, x) => s + x.amount, 0);
      if (Math.abs(sum - amount) > 0.01) {
        return res.status(400).json({ message: "Custom splits must add up to the total amount" });
      }
    } else if (splitType === "percentage") {
      const totalPct = Object.values(percentages).reduce((s, p) => s + p, 0);
      if (Math.abs(totalPct - 100) > 0.01) {
        return res.status(400).json({ message: "Percentages must add up to 100" });
      }
      splits = splitByPercentage(amount, percentages);
    } else {
      // default: equal split among all group members
      splits = splitEqually(amount, group.members);
    }

    const expense = await Expense.create({
      group: groupId,
      paidBy: req.user._id,
      description,
      amount,
      splitType: splitType || "equal",
      splits,
    });

    const populated = await expense.populate([
      { path: "paidBy", select: "name email" },
      { path: "splits.user", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/expenses/group/:groupId
export const getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate("paidBy", "name email")
      .populate("splits.user", "name email")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/expenses/group/:groupId/balances
// Returns both the raw net balance per person AND the simplified
// "who should pay whom" list.
export const getGroupBalances = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId });

    const balances = calculateBalances(expenses); // { userId: netAmount }
    const settlements = simplifyDebts(balances);   // [{ from, to, amount }]

    res.json({ balances, settlements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};