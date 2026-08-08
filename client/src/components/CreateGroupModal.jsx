import { useState } from "react";
import api from "../api/axios.js";

const CreateGroupModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const memberEmails = emails
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const { data } = await api.post("/groups", { name, memberEmails });
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center px-6 z-20">
      <div className="receipt-card w-full max-w-md p-8">
        <h2 className="font-display text-2xl font-semibold text-ink mb-1">New group</h2>
        <p className="text-sm text-ink-light mb-6">Start a fresh tab for a trip, house, or hangout.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-ink-light mb-1.5">
              Group name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Goa Trip"
              className="w-full border border-line rounded px-3 py-2.5 bg-paper focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-ink-light mb-1.5">
              Invite by email
            </label>
            <input
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="friend@example.com, another@example.com"
              className="w-full border border-line rounded px-3 py-2.5 bg-paper focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition"
            />
            <p className="text-xs text-ink-light mt-1.5">
              Comma-separated. They need an existing account for now.
            </p>
          </div>

          {error && (
            <p className="text-rust text-sm bg-rust-light px-3 py-2 rounded">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-line text-ink-light font-medium py-2.5 rounded hover:bg-paper-dark transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-ink text-paper font-medium py-2.5 rounded hover:bg-ink/90 transition disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;