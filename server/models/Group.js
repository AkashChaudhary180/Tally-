import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // "ref" tells Mongoose this ID points to a document in another
    // collection (User). Lets us do .populate("members") later to
    // fetch full user details instead of just IDs.
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
export default Group;