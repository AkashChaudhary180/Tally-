import mongoose from "mongoose";

// A "split" says: this specific user owes this specific amount
// FROM this one expense. We store it explicitly (rather than just
// assuming equal split) so custom/percentage splits are supported
// and the math is always auditable later.
const splitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // how much THIS user owes for this expense
  },
  { _id: false } // don't need a separate id for each split sub-document
);

const expenseSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true }, // total expense amount
    splitType: {
      type: String,
      enum: ["equal", "custom", "percentage"],
      default: "equal",
    },
    splits: [splitSchema],
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;