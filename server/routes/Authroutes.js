import express from "express";
import { registerUser, loginUser } from "../controllers/Authcontroller.js";

const router = express.Router();

// This is the "mapping" layer: URL -> controller function.
// Note the base path (/api/auth) is added later in server.js
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;