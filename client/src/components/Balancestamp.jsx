// The signature visual element of the whole app: a rotated, ink-stamp
// style badge. Positive amount = moss green "you're owed", negative
// or owing = rust "you owe". Used on dashboard cards and balance screens.
const BalanceStamp = ({ amount, size = "md" }) => {
  const isOwed = amount >= 0;
  const colorClass = isOwed ? "text-moss" : "text-rust";
  const label = isOwed ? "owed" : "you owe";
  const sizeClass = size === "lg" ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5";

  if (Math.abs(amount) < 0.01) {
    return (
      <span className={`stamp text-ink-light ${sizeClass}`}>settled up</span>
    );
  }

  return (
    <span className={`stamp ${colorClass} ${sizeClass}`}>
      {label} ₹{Math.abs(amount).toFixed(2)}
    </span>
  );
};

export default BalanceStamp;