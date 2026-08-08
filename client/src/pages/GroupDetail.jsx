import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import AddExpenseModal from "../components/AddExpenseModal.jsx";
import BalanceStamp from "../components/Balancestamp.jsx";

const GroupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balanceData, setBalanceData] = useState({ balances: {}, settlements: [] });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [groupRes, expensesRes, balancesRes] = await Promise.all([
      api.get(`/groups/${id}`),
      api.get(`/expenses/group/${id}`),
      api.get(`/expenses/group/${id}/balances`),
    ]);
    setGroup(groupRes.data);
    setExpenses(expensesRes.data);
    setBalanceData(balancesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const nameOf = (userId) => {
    if (userId === user._id) return "you";
    const member = group?.members.find((m) => m._id === userId);
    return member?.name || "someone";
  };

  if (loading || !group) {
    return <p className="max-w-3xl mx-auto px-6 py-10 text-ink-light font-mono text-sm">Loading…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-ink-light hover:text-rust transition">
        ← all groups
      </Link>

      <div className="flex items-start justify-between mt-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{group.name}</h1>
          <p className="text-xs font-mono text-ink-light mt-1">
            {group.members.map((m) => m.name).join(", ")}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-ink text-paper font-medium px-5 py-2.5 rounded hover:bg-ink/90 transition whitespace-nowrap"
        >
          + Add expense
        </button>
      </div>

      {/* Balance / settlement section */}
      <div className="receipt-card p-6 mb-8">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Balance</h2>
        <div className="mb-5">
          <BalanceStamp amount={balanceData.balances[user._id] || 0} size="lg" />
        </div>

        {balanceData.settlements.length === 0 ? (
          <p className="text-sm text-ink-light">Everyone's settled up. Nice.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wide text-ink-light mb-2">
              To settle up
            </p>
            {balanceData.settlements.map((s, i) => (
              <div key={i} className="flex items-center text-sm">
                <span className="text-ink font-medium">{nameOf(s.from)}</span>
                <span className="leader" />
                <span className="text-ink-light">pays</span>
                <span className="mx-1.5 text-ink font-medium">{nameOf(s.to)}</span>
                <span className="font-mono text-rust font-bold ml-1">
                  ₹{s.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses list, styled like an itemized receipt */}
      <div className="receipt-card p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-ink-light">No expenses logged yet — add the first one.</p>
        ) : (
          <ul className="divide-y divide-line">
            {expenses.map((exp) => (
              <li key={exp._id} className="py-3 flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-ink font-medium truncate">{exp.description}</p>
                  <p className="text-xs text-ink-light font-mono mt-0.5">
                    {exp.paidBy.name === user.name ? "you" : exp.paidBy.name} paid
                  </p>
                </div>
                <span className="leader" />
                <span className="font-mono font-bold text-ink">₹{exp.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <AddExpenseModal
          group={group}
          onClose={() => setShowModal(false)}
          onAdded={() => fetchAll()}
        />
      )}
    </div>
  );
};

export default GroupDetail;