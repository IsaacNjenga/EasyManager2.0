import { Button, Card, Divider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
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
          (acc, expense) => acc + expense.cost + dailyTotalCommissions,
          0
        );

        const netProfit = dailyTotalAmount - dailyExpenseAmount;
        const dailyTotalProfit = netProfit > 0 ? netProfit : 0;

        totalDayAmount[`day ${dayNumber}`] = dailyTotalAmount;
        totalDayProfit[`day ${dayNumber}`] = dailyTotalProfit;
        totalDayExpense[`day ${dayNumber}`] = dailyExpenseAmount;

        dailyData[`day ${dayNumber}`] = {
          day: `day ${dayNumber}`,
          startDate: dayStartDate.toISOString().slice(0, 10),
          endDate: dayEndDate.toISOString().slice(0, 10),
          sales: dailySales.length,
          totalAmount: dailyTotalAmount,
          totalProfit: dailyTotalProfit,
          totalExpense: dailyExpenseAmount,
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
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const totalMonthAmount = {};
      const totalMonthProfit = {};
      const totalMonthExpense = {};

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
          (acc, expense) => acc + expense.cost + monthlyTotalCommissions,
          0
        );

        const netProfit = monthTotalAmount - monthExpenseAmount;
        const monthTotalProfit = netProfit > 0 ? netProfit : 0;

        totalMonthAmount[`month ${monthNumber}`] = monthTotalAmount;
        totalMonthProfit[`month ${monthNumber}`] = monthTotalProfit;
        totalMonthExpense[`month ${monthNumber}`] = monthExpenseAmount;

        monthsData[`month ${monthNumber}`] = {
          month: `month ${monthNumber}`,
          startDate: monthStartDate.toISOString().slice(0, 10),
          endDate: monthEndDate.toISOString().slice(0, 10),
          sales: monthSales.length,
          totalAmount: monthTotalAmount,
          totalProfit: monthTotalProfit,
          totalExpense: monthExpenseAmount,
        };
      }

      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthNumber = i + 1;
        return {
          name: monthNames[i],
          Revenue: totalMonthAmount[`month ${monthNumber}`] || 0,
          Profit: totalMonthProfit[`month ${monthNumber}`] || 0,
          Expenses: totalMonthExpense[`month ${monthNumber}`] || 0,
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
        <>
          <Card title="Monthly Sales & Expenses Report">
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => monthlyReport("prevMonth")}
                style={{ background: "red", color: "white" }}
              >
                Last Month
              </Button>
              <Button
                onClick={() => monthlyReport("currentMonth")}
                style={{ background: "green", color: "white" }}
              >
                This Month
              </Button>
              <Button
                onClick={() => monthlyReport("nextMonth")}
                style={{ background: "#00152a", color: "white" }}
              >
                Next Month
              </Button>
            </div>
            <Divider variant="solid">
              {currentMonth.toLocaleDateString("en-UK", {
                month: "long",
                year: "numeric",
              })}
            </Divider>

            <BarChart
              width={1100}
              height={400}
              data={dayData}
              margin={{ left: 40, right: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value.toLocaleString()}`}>
                <Label
                  value="(Ksh)"
                  offset={-20}
                  position="insideLeft"
                  style={{ textAnchor: "middle", fontSize: "16px" }}
                />
              </YAxis>
              <Legend />
              <Tooltip
                formatter={(value, name, props) =>
                  `Ksh.${value.toLocaleString()}`
                }
              />

              <Bar dataKey="Revenue" fill="green">
                {monthData.map((entry, index) => (
                  <Rectangle
                    key={`bar-${index}`}
                    width={5}
                    height={entry.Revenue}
                    fill="#8884d8"
                  />
                ))}
              </Bar>
              <Bar dataKey="Profit" fill="blue">
                {dayData.map((entry, index) => (
                  <Rectangle
                    key={`bar-${index}`}
                    width={5}
                    height={entry.Profit}
                    fill="#82ca9d"
                  />
                ))}
              </Bar>
              <Bar dataKey="Expenses" fill="red">
                {dayData.map((entry, index) => (
                  <Rectangle
                    key={`bar-${index}`}
                    width={5}
                    height={entry.Expenses}
                    fill="red"
                  />
                ))}
              </Bar>
            </BarChart>
          </Card>
          <Card title="Yearly Sales & Expenses Report">
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => yearlyReport("prevYear")}
                style={{ background: "red", color: "white" }}
              >
                Last Year
              </Button>
              <Button
                onClick={() => yearlyReport("currentYear")}
                style={{ background: "green", color: "white" }}
              >
                This Year
              </Button>
              <Button
                onClick={() => yearlyReport("nextYear")}
                style={{ background: "#00152a", color: "white" }}
              >
                Next Year
              </Button>{" "}
            </div>
            <Divider variant="solid">
              {currentYear.toLocaleDateString("en-UK", {
                year: "numeric",
              })}
            </Divider>
            <BarChart
              width={1100}
              height={400}
              data={monthData}
              margin={{ left: 50, right: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value.toLocaleString()}`}>
                <Label
                  value="(Ksh)"
                  offset={-30}
                  position="insideLeft"
                  style={{ textAnchor: "middle", fontSize: "16px" }}
                />
              </YAxis>
              <Legend />
              <Tooltip
                formatter={(value, name, props) =>
                  `Ksh.${value.toLocaleString()}`
                }
              />

              <Bar dataKey="Revenue" fill="green">
                {monthData.map((entry, index) => (
                  <Rectangle
                    key={`bar-${index}`}
                    width={5}
                    height={entry.Revenue}
                    fill="#8884d8"
                  />
                ))}
              </Bar>
              <Bar dataKey="Profit" fill="blue">
                {monthData.map((entry, index) => (
                  <Rectangle
                    key={`bar-${index}`}
                    width={5}
                    height={entry.Profit}
                    fill="#82ca9d"
                  />
                ))}
              </Bar>
              <Bar dataKey="Expenses" fill="red">
                {dayData.map((entry, index) => (
                  <Rectangle
                    key={`bar-${index}`}
                    width={5}
                    height={entry.Expenses}
                    fill="#82ca9d"
                  />
                ))}
              </Bar>
            </BarChart>
          </Card>
        </>
      )}
    </>
  );
}

export default ReportsContent;
