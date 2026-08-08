import express from "express";
import {
  addExpense,
  getGroupExpenses,
  getGroupBalances,
} from "../controllers/Expensecontroller.js";
import protect from "../middleware/Authmiddleware.js";

const router = express.Router();

router.post("/", protect, addExpense);
router.get("/group/:groupId", protect, getGroupExpenses);
router.get("/group/:groupId/balances", protect, getGroupBalances);

export default router;