// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/Authroutes.js";
// import groupRoutes from "./routes/Grouproutes.js";
// import expenseRoutes from "./routes/Expenseroutes.js";

// dotenv.config(); // load variables from .env into process.env
// connectDB();      // connect to MongoDB (see config/db.js)

// const app = express();

// app.use(cors());          // allow requests from our React frontend
// app.use(express.json());  // parse incoming JSON request bodies into req.body

// // Every route file gets "mounted" under a base path here.
// // So POST /register in authRoutes.js becomes POST /api/auth/register
// app.use("/api/auth", authRoutes);
// app.use("/api/groups", groupRoutes);
// app.use("/api/expenses", expenseRoutes);

// app.get("/", (req, res) => {
//   res.send("BillSplit API is running");
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/Authroutes.js";
import groupRoutes from "./routes/Grouproutes.js";
import expenseRoutes from "./routes/Expenseroutes.js";

dotenv.config(); // load variables from .env into process.env
connectDB();      // connect to MongoDB (see config/db.js)

const app = express();

// Only these exact origins are allowed to call this API. Your local dev
// server AND your deployed frontend both need to be listed — anything
// else (including random other websites) gets blocked by the browser.
const allowedOrigins = [
  "http://localhost:5173",
  "https://tally1-lvqw.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());  // parse incoming JSON request bodies into req.body

// Every route file gets "mounted" under a base path here.
// So POST /register in authRoutes.js becomes POST /api/auth/register
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("BillSplit API is running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));