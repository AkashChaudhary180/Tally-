import mongoose from "mongoose";

// This function connects to MongoDB using the URI from our .env file.
// We keep it in its own file so server.js stays clean and this logic
// is reusable/testable on its own.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // stop the app — no point running without a DB
  }
};

export default connectDB;