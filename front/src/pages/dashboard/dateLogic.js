export function getDashboardData({ salesData, expenses, day }) {
  //console.log(salesData);
  let sales = salesData;
  let expensesData = expenses;
  // Helper function to filter sales and expenses by a specific date range
  const filterByDateRange = (data, dateKey, days) => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const currentDateTime = new Date();

    if (days === 1) {
      startDate.setDate(currentDateTime.getDate() - 1);
      endDate.setDate(currentDateTime.getDate() - 1);
    }

    return data.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  //filter random date
  const filterSelectedDateDate = (data, dateKey, selectedDate) => {
    if (!selectedDate) return [];

    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    return data.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  //  Filter today's data correctly
  const filteredSales = filterByDateRange(sales, "datesold", 0);
  const filteredExpenses = filterByDateRange(expensesData, "date", 0);

  const revenueToday = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  const commissionsToday = filteredSales.reduce(
    (acc, sale) => acc + sale.commission,
    0
  );

  const expenseToday = filteredExpenses.reduce(
    (acc, expense) => acc + expense.cost,
    0
  );

  const profitToday =
    Number(revenueToday) - Number(expenseToday + commissionsToday);

  // Yesterday's data
  const filteredSalesYesterday = filterByDateRange(sales, "datesold", 1);
  const filteredExpensesYesterday = filterByDateRange(expensesData, "date", 1);

  const revenueYesterday = filteredSalesYesterday.reduce(
    (acc, sale) => acc + sale.total,
    0
  );
  const commissionsYesterday = filteredSalesYesterday.reduce(
    (acc, sale) => acc + sale.commission,
    0
  );
  const expenseYesterday = filteredExpensesYesterday.reduce(
    (acc, expense) => acc + expense.cost,
    0
  );

  const profitYesterday =
    Number(revenueYesterday) - Number(expenseYesterday + commissionsYesterday);

  // Weekly data
  const filteredSalesLastWeek = filterByDateRange(sales, "datesold", 7);
  const filteredExpensesLastWeek = filterByDateRange(expensesData, "date", 7);

  const revenueWeekly = filteredSalesLastWeek.reduce(
    (acc, sale) => acc + sale.total,
    0
  );
  const commissionsWeekly = filteredSalesLastWeek.reduce(
    (acc, sale) => acc + sale.commission,
    0
  );
  const expenseWeekly = filteredExpensesLastWeek.reduce(
    (acc, expense) => acc + expense.cost,
    0
  );

  const profitWeekly =
    Number(revenueWeekly) - Number(expenseWeekly + commissionsWeekly);

  // Monthly data
  const filteredSalesLastMonth = filterByDateRange(sales, "datesold", 31);
  const filteredExpensesLastMonth = filterByDateRange(expensesData, "date", 31);

  const revenueMonthly = filteredSalesLastMonth.reduce(
    (acc, sale) => acc + sale.total,
    0
  );
  const commissionsMonthly = filteredSalesLastMonth.reduce(
    (acc, sale) => acc + sale.commission,
    0
  );

  const expenseMonthly = filteredExpensesLastMonth.reduce(
    (acc, expense) => acc + expense.cost,
    0
  );

  const profitMonthly =
    Number(revenueMonthly) - Number(expenseMonthly + commissionsMonthly);

  //filter selectedDate data
  const filteredSelectedDateSales = filterSelectedDateDate(
    sales,
    "datesold",
    day
  );
  const filteredSelectedDateExpenses = filterSelectedDateDate(
    expensesData,
    "date",
    day
  );

  const selectedDateRevenue = filteredSelectedDateSales.reduce(
    (acc, sale) => acc + sale.total,
    0
  );

  const selectedDateCommissions = filteredSelectedDateSales.reduce(
    (acc, sale) => acc + sale.commission,
    0
  );

  const selectedDateExpense = filteredSelectedDateExpenses.reduce(
    (acc, expense) => acc + expense.cost,
    0
  );

  const selectedDateProfit =
    Number(selectedDateRevenue) -
    Number(selectedDateExpense + selectedDateCommissions);

  return {
    revenueToday,
    revenueYesterday,
    revenueWeekly,
    revenueMonthly,
    selectedDateRevenue,
    expenseToday,
    expenseYesterday,
    expenseWeekly,
    expenseMonthly,
    selectedDateExpense,
    commissionsToday,
    commissionsYesterday,
    commissionsWeekly,
    commissionsMonthly,
    selectedDateCommissions,
    profitToday,
    profitYesterday,
    profitWeekly,
    profitMonthly,
    selectedDateProfit,
  };
}
