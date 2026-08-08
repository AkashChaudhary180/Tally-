import { useState } from "react";
import api from "../api/axios.js";

const AddExpenseModal = ({ group, onClose, onAdded }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [customAmounts, setCustomAmounts] = useState({}); // { userId: "12.50" }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        groupId: group._id,
        description,
        amount: parseFloat(amount),
        splitType,
      };

      if (splitType === "custom") {
        payload.customSplits = group.members.map((m) => ({
          user: m._id,
          amount: parseFloat(customAmounts[m._id] || 0),
        }));
      }

      const { data } = await api.post("/expenses", payload);
      onAdded(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't add expense");
    } finally {
      setLoading(false);
    }
  };

  const customTotal = Object.values(customAmounts).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center px-6 z-20 py-8 overflow-y-auto">
      <div className="receipt-card w-full max-w-md p-8">
        <h2 className="font-display text-2xl font-semibold text-ink mb-1">Add an expense</h2>
        <p className="text-sm text-ink-light mb-6">Log it, and we'll do the math.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-ink-light mb-1.5">
              What was it for?
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner at the beach shack"
              className="w-full border border-line rounded px-3 py-2.5 bg-paper focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-ink-light mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-line rounded px-3 py-2.5 bg-paper font-mono focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-ink-light mb-2">
              Split
            </label>
            <div className="flex gap-2 mb-3">
              {["equal", "custom"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSplitType(type)}
                  className={`flex-1 py-2 rounded text-sm font-medium border transition capitalize ${
                    splitType === type
                      ? "bg-ink text-paper border-ink"
                      : "border-line text-ink-light hover:bg-paper-dark"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {splitType === "equal" && (
              <p className="text-xs text-ink-light font-mono">
                Split evenly across all {group.members.length} members.
              </p>
            )}

            {splitType === "custom" && (
              <div className="space-y-2 border-t border-line pt-3">
                {group.members.map((m) => (
                  <div key={m._id} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-ink flex-1 truncate">{m.name}</span>
                    <span className="leader" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={customAmounts[m._id] || ""}
                      onChange={(e) =>
                        setCustomAmounts((prev) => ({ ...prev, [m._id]: e.target.value }))
                      }
                      className="w-24 border border-line rounded px-2 py-1 bg-paper font-mono text-sm text-right focus:outline-none focus:ring-2 focus:ring-gold/60"
                    />
                  </div>
                ))}
                <p
                  className={`text-xs font-mono text-right pt-1 ${
                    Math.abs(customTotal - parseFloat(amount || 0)) > 0.01
                      ? "text-rust"
                      : "text-moss"
                  }`}
                >
                  total: ₹{customTotal.toFixed(2)} / ₹{parseFloat(amount || 0).toFixed(2)}
                </p>
              </div>
            )}
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
              {loading ? "Adding…" : "Add expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;