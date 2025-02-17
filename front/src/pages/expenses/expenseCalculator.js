export function getTotalExpenses({ expenses }) {
  const totalExpenditure = expenses
    .reduce((acc, expense) => acc + expense.cost, 0)
    .toLocaleString();

  return { totalExpenditure };
}
