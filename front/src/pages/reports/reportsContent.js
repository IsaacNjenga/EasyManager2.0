import { Button, Card, Divider } from "antd";
import { useCallback, useEffect, useState } from "react";
import Loader from "../../components/loader";
import useSales from "../../assets/hooks/saleHook";
import useExpenses from "../../assets/hooks/expensesHook";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  Rectangle,
  Label,
  BarChart,
  Bar,
} from "recharts";
import { CalendarOutlined, StockOutlined } from "@ant-design/icons";

function ReportsContent() {
  const { salesData, salesLoading } = useSales();
  const { expenses, expensesLoading } = useExpenses();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date());
  const [dayData, setDayData] = useState([]);
  const [monthData, setMonthData] = useState([]);

  const monthlyReport = useCallback(
    (action) => {
      let newMonth = new Date(currentMonth);
      if (action === "prevMonth") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else if (action === "nextMonth") {
        newMonth.setMonth(newMonth.getMonth() + 1);
      } else if (action === "currentMonth") {
        newMonth = new Date();
      }

      newMonth.setDate(1);
      newMonth.setHours(0, 0, 0, 0);
      if (newMonth.getTime() !== currentMonth.getTime()) {
        setCurrentMonth(newMonth);
      }
      let StartDate = new Date(newMonth);
      let currentDate = new Date(StartDate);

      const totalDayAmount = {};
      const totalDayExpense = {};
      const totalDayProfit = {};
      const totalDayCommission = {};

      const dailyData = {};
      let updatedDayData = [];

      for (let i = 1; i <= 31; i++) {
        const dayStartDate = new Date(currentDate);
        const dayEndDate = new Date(dayStartDate);
        dayEndDate.setHours(23, 59, 59, 999);

        const dailySales = salesData.filter((sale) => {
          const saleDate = new Date(sale.datesold);
          return saleDate >= dayStartDate && saleDate <= dayEndDate;
        });

        const dailyExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= dayStartDate && expenseDate <= dayEndDate;
        });

        const dayNumber = i;
        const dailyTotalAmount = dailySales.reduce(
          (acc, sale) => acc + sale.total,
          0
        );

        const dailyTotalCommissions = dailySales.reduce(
          (acc, sale) => acc + sale.commission,
          0
        );
        const dailyExpenseAmount = dailyExpenses.reduce(
          (acc, expense) => acc + expense.cost,
          0
        );

        const netProfit = dailyTotalAmount - dailyExpenseAmount;
        const dailyTotalProfit = netProfit > 0 ? netProfit : 0;

        totalDayAmount[`day ${dayNumber}`] = dailyTotalAmount;
        totalDayProfit[`day ${dayNumber}`] = dailyTotalProfit;
        totalDayExpense[`day ${dayNumber}`] = dailyExpenseAmount;
        totalDayCommission[`day ${dayNumber}`] = dailyTotalCommissions;

        dailyData[`day ${dayNumber}`] = {
          day: `day ${dayNumber}`,
          startDate: dayStartDate.toISOString().slice(0, 10),
          endDate: dayEndDate.toISOString().slice(0, 10),
          sales: dailySales.length,
          totalAmount: dailyTotalAmount,
          totalProfit: dailyTotalProfit,
          totalExpense: dailyExpenseAmount,
          totalCommission: dailyTotalCommissions,
        };

        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      const currentMonthName = currentDate.getMonth();
      let days;
      if (
        currentMonthName === 9 ||
        currentMonthName === 4 ||
        currentMonthName === 6 ||
        currentMonthName === 11
      ) {
        days = 30;
      } else if (currentMonthName === 2) {
        const currentYear = currentDate.getFullYear();
        if (
          (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
          currentYear % 400 === 0
        ) {
          days = 29;
        } else {
          days = 28;
        }
      } else {
        days = 31;
      }

      for (let i = 1; i <= days; i++) {
        let daySuffix;
        if (i === 1 || i === 21 || i === 31) {
          daySuffix = `${i}st`;
        } else if (i === 2 || i === 22) {
          daySuffix = `${i}nd`;
        } else if (i === 3 || i === 23) {
          daySuffix = `${i}rd`;
        } else {
          daySuffix = `${i}th`;
        }

        updatedDayData.push({
          name: daySuffix,
          Revenue: totalDayAmount[`day ${i}`],
          Profit: totalDayProfit[`day ${i}`],
          Expenses: totalDayExpense[`day ${i}`],
          Commissions: totalDayCommission[`day ${i}`],
        });
      }
      setDayData(updatedDayData);
    },
    [salesData, expenses, currentMonth]
  );

  const yearlyReport = useCallback(
    (action) => {
      let newYear = new Date(currentYear);
      if (action === "prevYear") {
        newYear.setFullYear(newYear.getFullYear() - 1);
        newYear.setMonth(0, 1);
      } else if (action === "nextYear") {
        newYear.setFullYear(newYear.getFullYear() + 1);
        newYear.setMonth(0, 1);
      } else if (action === "currentYear") {
        newYear = new Date();
        newYear.setMonth(0, 1);
      }

      if (newYear.getTime() !== currentYear.getTime()) {
        setCurrentYear(newYear);
      }
      const year = newYear.getFullYear();
      const monthsData = {};
      const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      const totalMonthAmount = {};
      const totalMonthProfit = {};
      const totalMonthExpense = {};
      const totalMonthCommission = {};

      for (let i = 0; i < 12; i++) {
        const monthStartDate = new Date(year, i, 1);
        const monthEndDate = new Date(year, i + 1, 0);

        const monthSales = salesData.filter((sale) => {
          const saleDate = new Date(sale.datesold);
          return saleDate >= monthStartDate && saleDate <= monthEndDate;
        });
        const monthExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= monthStartDate && expenseDate <= monthEndDate;
        });

        const monthNumber = i + 1;
        const monthTotalAmount = monthSales.reduce(
          (acc, sale) => acc + sale.total,
          0
        );
        const monthlyTotalCommissions = monthSales.reduce(
          (acc, sale) => acc + sale.commission,
          0
        );
        const monthExpenseAmount = monthExpenses.reduce(
          (acc, expense) => acc + expense.cost,
          0
        );

        const netProfit = monthTotalAmount - monthExpenseAmount;
        const monthTotalProfit = netProfit > 0 ? netProfit : 0;

        totalMonthAmount[`month ${monthNumber}`] = monthTotalAmount;
        totalMonthProfit[`month ${monthNumber}`] = monthTotalProfit;
        totalMonthExpense[`month ${monthNumber}`] = monthExpenseAmount;
        totalMonthCommission[`month ${monthNumber}`] = monthlyTotalCommissions;

        monthsData[`month ${monthNumber}`] = {
          month: `month ${monthNumber}`,
          startDate: monthStartDate.toISOString().slice(0, 10),
          endDate: monthEndDate.toISOString().slice(0, 10),
          sales: monthSales.length,
          totalAmount: monthTotalAmount,
          totalProfit: monthTotalProfit,
          totalExpense: monthExpenseAmount,
          totalCommission: monthlyTotalCommissions,
        };
      }

      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthNumber = i + 1;
        return {
          name: monthNames[i],
          Revenue: totalMonthAmount[`month ${monthNumber}`] || 0,
          Profit: totalMonthProfit[`month ${monthNumber}`] || 0,
          Expenses: totalMonthExpense[`month ${monthNumber}`] || 0,
          Commissions: totalMonthCommission[`month ${monthNumber}`] || 0,
        };
      });

      setMonthData(monthlyData);
    },
    [salesData, expenses, currentYear]
  );

  useEffect(() => {
    yearlyReport();
    monthlyReport();
  }, [yearlyReport, monthlyReport]);

  return (
    <>
      {salesLoading || expensesLoading ? (
        <Loader />
      ) : (
        <div style={styles.container}>
          <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chart-container {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          margin-top: 16px;
        }
        .ant-card {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

          <div style={styles.header}>
            <h1 style={styles.title}>Financial Reports</h1>
          </div>

          <Card
            title={
              <span style={styles.cardTitle}>
                <StockOutlined style={styles.cardIcon} />
                Monthly Sales & Expenses Report
              </span>
            }
            style={styles.card}
          >
            <div style={styles.buttonGroup}>
              <Button
                onClick={() => monthlyReport("prevMonth")}
                type="primary"
                danger
                size="large"
                style={styles.button}
              >
                ← Previous Month
              </Button>
              <Button
                onClick={() => monthlyReport("currentMonth")}
                type="primary"
                size="large"
                style={{
                  ...styles.button,
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
              >
                This Month
              </Button>
              <Button
                onClick={() => monthlyReport("nextMonth")}
                type="primary"
                size="large"
                style={{
                  ...styles.button,
                  background: "#00152a",
                  borderColor: "#00152a",
                }}
              >
                Next Month →
              </Button>
            </div>

            <Divider style={styles.divider}>
              <span style={styles.dividerText}>
                <CalendarOutlined style={{ marginRight: "8px" }} />
                {currentMonth.toLocaleDateString("en-UK", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </Divider>

            <div className="chart-container">
              <BarChart
                width={900}
                height={400}
                data={dayData}
                margin={{ left: 0, right: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                  stroke="#666"
                >
                  <Label
                    offset={0}
                    position="insideLeft"
                    style={{
                      textAnchor: "left",
                      fontSize: "10px",
                      fill: "#666",
                    }}
                  />
                </YAxis>
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Tooltip
                  formatter={(value, name, props) =>
                    `Ksh.${value.toLocaleString()}`
                  }
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="Revenue" fill="#1890ff" radius={[8, 8, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Revenue}
                      fill="#1890ff"
                    />
                  ))}
                </Bar>
                <Bar dataKey="Profit" fill="#52c41a" radius={[8, 8, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Profit}
                      fill="#52c41a"
                    />
                  ))}
                </Bar>
                <Bar dataKey="Expenses" fill="#ff4d4f" radius={[8, 8, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Expenses}
                      fill="#ff4d4f"
                    />
                  ))}
                </Bar>
                <Bar dataKey="Commissions" fill="#faad14" radius={[8, 8, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Commissions}
                      fill="#faad14"
                    />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </Card>

          <Card
            title={
              <span style={styles.cardTitle}>
                <StockOutlined style={styles.cardIcon} />
                Yearly Sales & Expenses Report
              </span>
            }
            style={styles.card}
          >
            <div style={styles.buttonGroup}>
              <Button
                onClick={() => yearlyReport("prevYear")}
                type="primary"
                danger
                size="large"
                style={styles.button}
              >
                ← Previous Year
              </Button>
              <Button
                onClick={() => yearlyReport("currentYear")}
                type="primary"
                size="large"
                style={{
                  ...styles.button,
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
              >
                This Year
              </Button>
              <Button
                onClick={() => yearlyReport("nextYear")}
                type="primary"
                size="large"
                style={{
                  ...styles.button,
                  background: "#00152a",
                  borderColor: "#00152a",
                }}
              >
                Next Year →
              </Button>
            </div>

            <Divider style={styles.divider}>
              <span style={styles.dividerText}>
                <CalendarOutlined style={{ marginRight: "8px" }} />
                {currentYear.toLocaleDateString("en-UK", {
                  year: "numeric",
                })}
              </span>
            </Divider>

            <div className="chart-container">
              <BarChart
                width={900}
                height={400}
                data={monthData}
                margin={{ left: 0, right: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                  stroke="#666"
                >
                  <Label
                    offset={0}
                    position="insideLeft"
                    style={{
                      textAnchor: "middle",
                      fontSize: "10px",
                      fill: "#666",
                    }}
                  />
                </YAxis>
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Tooltip
                  formatter={(value, name, props) =>
                    `Ksh.${value.toLocaleString()}`
                  }
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="Revenue" fill="#1890ff" radius={[8, 8, 0, 0]}>
                  {monthData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Revenue}
                      fill="#1890ff"
                    />
                  ))}
                </Bar>
                <Bar dataKey="Profit" fill="#52c41a" radius={[8, 8, 0, 0]}>
                  {monthData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Profit}
                      fill="#52c41a"
                    />
                  ))}
                </Bar>
                <Bar dataKey="Expenses" fill="#ff4d4f" radius={[8, 8, 0, 0]}>
                  {monthData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Expenses}
                      fill="#ff4d4f"
                    />
                  ))}
                </Bar>
                <Bar dataKey="Commissions" fill="#faad14" radius={[8, 8, 0, 0]}>
                  {monthData.map((entry, index) => (
                    <Rectangle
                      key={`bar-${index}`}
                      width={5}
                      height={entry.Commissions}
                      fill="#faad14"
                    />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 50%, #f9f0ff 100%)",
    padding: "10px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1f1f1f",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  titleIcon: {
    fontSize: "40px",
    color: "#52c41a",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginTop: "8px",
  },
  card: {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginBottom: "32px",
    maxWidth: "1500px",
    margin: "0 auto 12px",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  cardIcon: {
    fontSize: "24px",
    color: "#1890ff",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  button: {
    fontWeight: "600",
    height: "42px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  divider: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  dividerText: {
    background: "#f5f5f5",
    padding: "8px 16px",
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
  },
};

export default ReportsContent;
