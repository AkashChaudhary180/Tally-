// --- Splitting an expense among members ---

// Given a total amount and a list of member IDs, split equally.
// Handles rounding: if 100 / 3 doesn't divide evenly, the last person
// absorbs the leftover cent(s) so the splits always sum EXACTLY to
// the total (this is a classic real-world bug if you skip it).
export const splitEqually = (amount, memberIds) => {
  const share = Math.floor((amount / memberIds.length) * 100) / 100;
  const splits = memberIds.map((user) => ({ user, amount: share }));

  const distributed = share * memberIds.length;
  const remainder = Math.round((amount - distributed) * 100) / 100;
  splits[splits.length - 1].amount = Math.round((splits[splits.length - 1].amount + remainder) * 100) / 100;

  return splits;
};

// Given percentages per member (e.g. { userId: 50, userId2: 50 }),
// convert to actual amounts. Caller is responsible for checking
// percentages add up to 100 before calling this.
export const splitByPercentage = (amount, percentages) => {
  return Object.entries(percentages).map(([user, pct]) => ({
    user,
    amount: Math.round(amount * (pct / 100) * 100) / 100,
  }));
};

// --- Computing balances from a list of expenses ---

// Core idea: for every expense, the person who PAID gets credited
// the full amount, and everyone in the splits gets debited their share.
// Net balance per person = total paid - total owed.
// Positive balance = other people owe THEM. Negative = they owe others.
export const calculateBalances = (expenses) => {
  const balances = {}; // { userId: netAmount }

  for (const expense of expenses) {
    const payerId = expense.paidBy.toString();
    balances[payerId] = (balances[payerId] || 0) + expense.amount;

    for (const split of expense.splits) {
      const userId = split.user.toString();
      balances[userId] = (balances[userId] || 0) - split.amount;
    }
  }

  // Round to avoid floating point dust like 0.00000001
  for (const id in balances) {
    balances[id] = Math.round(balances[id] * 100) / 100;
  }

  return balances; // e.g. { "userA": 30, "userB": -30 } → B owes A ₹30
};

// --- Debt simplification ---

// Turns raw net balances into the MINIMUM number of payments needed
// to settle everyone up. Classic greedy approach:
// repeatedly match the person who owes the MOST with the person
// who is owed the MOST, settle as much as possible between them,
// and repeat until everyone is at zero.
export const simplifyDebts = (balances) => {
  // Split into creditors (owed money, positive) and debtors (owe money, negative)
  const creditors = [];
  const debtors = [];

  for (const [userId, amount] of Object.entries(balances)) {
    if (amount > 0.01) creditors.push({ userId, amount });
    else if (amount < -0.01) debtors.push({ userId, amount: -amount }); // store as positive "owes X"
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settledAmount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: Math.round(settledAmount * 100) / 100,
    });

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) i++;      // this debtor is fully settled, move on
    if (creditor.amount < 0.01) j++;    // this creditor is fully settled, move on
  }

  return transactions;
};