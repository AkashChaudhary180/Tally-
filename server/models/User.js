import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// A Mongoose "schema" defines the shape + rules of a document.
// Think of it like a class blueprint for what a User looks like in the DB.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true }, // will store the HASH, never plain text
  },
  { timestamps: true } // auto-adds createdAt / updatedAt
);

// Mongoose "middleware" (a pre-save hook): this runs automatically
// right before a User document is saved to the DB.
// Here, we intercept the plain password and replace it with a hash.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password unchanged
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Custom instance method — lets us do `user.comparePassword(input)` later
// instead of manually calling bcrypt everywhere.
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;