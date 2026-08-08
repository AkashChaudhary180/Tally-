import Group from "../models/Group.js";
import User from "../models/User.js";

// POST /api/groups
// req.user is available here because this route goes through the
// `protect` middleware first (see routes/groupRoutes.js) — that's
// what guarantees req.user._id exists and is trustworthy.
export const createGroup = async (req, res) => {
  try {
    const { name, memberEmails } = req.body;
    // memberEmails: array of email strings, e.g. ["a@x.com", "b@x.com"]
    // (easier for a frontend form than asking for raw Mongo IDs)

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    // Look up the actual User documents for each email so we can store IDs
    let memberIds = [];
    if (memberEmails && memberEmails.length > 0) {
      const users = await User.find({ email: { $in: memberEmails } });
      memberIds = users.map((u) => u._id);
    }

    // Always include the creator as a member, and avoid duplicate IDs
    // in case they also listed their own email.
    const allMemberIds = [
      ...new Set([req.user._id.toString(), ...memberIds.map((id) => id.toString())]),
    ];

    const group = await Group.create({
      name,
      members: allMemberIds,
      createdBy: req.user._id,
    });

    // .populate() swaps the stored ObjectIds for the actual User documents
    // they reference, so the frontend gets names/emails, not just IDs.
    const populatedGroup = await group.populate("members", "name email");

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/groups
// Returns every group the logged-in user belongs to.
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/groups/:id
// Returns one group's details — but only if the requester is a member.
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate(
      "members",
      "name email"
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Security check: don't leak group data to non-members.
    const isMember = group.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};