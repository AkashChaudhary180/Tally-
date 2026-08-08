import express from "express";
import {
  createGroup,
  getMyGroups,
  getGroupById,
} from "../controllers/Groupcontroller.js";
import protect from "../middleware/Authmiddleware.js";

const router = express.Router();

// Passing `protect` as a second argument means: run the auth check
// FIRST, and only call the controller if it calls next().
// Every route below requires a valid login token.
router.post("/", protect, createGroup);
router.get("/", protect, getMyGroups);
router.get("/:id", protect, getGroupById);

export default router;