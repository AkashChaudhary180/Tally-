import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import CreateGroupModal from "../components/CreateGroupModal.jsx";
import BalanceStamp from "../components/Balancestamp.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState({}); // { groupId: netAmountForMe }
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    const { data } = await api.get("/groups");
    setGroups(data);

    // For each group, fetch balances so the dashboard card can show
    // "you're owed ₹X" at a glance without opening the group.
    const balanceEntries = await Promise.all(
      data.map(async (g) => {
        try {
          const res = await api.get(`/expenses/group/${g._id}/balances`);
          return [g._id, res.data.balances[user._id] || 0];
        } catch {
          return [g._id, 0];
        }
      })
    );
    setBalances(Object.fromEntries(balanceEntries));
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Your groups</h1>
          <p className="text-ink-light text-sm mt-1">
            {groups.length} open {groups.length === 1 ? "tab" : "tabs"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-ink text-paper font-medium px-5 py-2.5 rounded hover:bg-ink/90 transition"
        >
          + New group
        </button>
      </div>

      {loading ? (
        <p className="text-ink-light font-mono text-sm">Loading…</p>
      ) : groups.length === 0 ? (
        <div className="receipt-card p-12 text-center">
          <p className="font-display text-xl text-ink mb-2">No tabs open yet</p>
          <p className="text-ink-light text-sm mb-6">
            Start a group for a trip, house, or hangout — split the first bill and go.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-ink text-paper font-medium px-5 py-2.5 rounded hover:bg-ink/90 transition"
          >
            Create your first group
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Link
              key={group._id}
              to={`/groups/${group._id}`}
              className="receipt-card p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all block"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-ink">{group.name}</h3>
              </div>
              <p className="text-xs font-mono text-ink-light mb-4">
                {group.members.length} {group.members.length === 1 ? "member" : "members"}
              </p>
              <BalanceStamp amount={balances[group._id] || 0} />
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={(newGroup) => setGroups((prev) => [newGroup, ...prev])}
        />
      )}
    </div>
  );
};

export default Dashboard;