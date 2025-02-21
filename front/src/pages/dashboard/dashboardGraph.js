import React, { useCallback, useEffect, useState } from "react";
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
import { Button, Card, Divider, Spin } from "antd";
function DashboardGraph() {
  const { salesData, salesLoading } = useSales();
  const { expenses, expensesLoading } = useExpenses();
  const [currentWeekMonth, setCurrentWeekMonth] = useState(new Date());
  const [weekData, setWeekData] = useState([]);

  function getSuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const weekGraph = useCallback(
    (action) => {
      let newDate = new Date(currentWeekMonth);

      if (action === "nextWeek") {
        newDate.setDate(newDate.getDate() + 7);
      } else if (action === "lastWeek") {
        newDate.setDate(newDate.getDate() - 7);
      } else if (action === "currentWeek") {
        newDate = new Date();
      }

      if (newDate.getTime() !== currentWeekMonth.getTime()) {
        setCurrentWeekMonth(newDate);
      }

      let startDate = new Date(newDate);
      startDate.setHours(0, 0, 0, 0);

      const weeksData = {};

      for (let i = 1; i <= 7; i++) {
        const dayStartDate = new Date(startDate);
        const dayEndDate = new Date(startDate);
        dayEndDate.setHours(23, 59, 59, 999);

        const dayOfMonth = dayStartDate.getDate();
        const suffix = getSuffix(dayOfMonth);
        const month = dayStartDate.toLocaleString("en-UK", {
          month: "short",
        });
        const weekday = dayStartDate.toLocaleString("en-UK", {
          weekday: "long",
        });

        const dayName = `${weekday}, ${dayOfMonth}${suffix} ${month}`;

        const weekSales = salesData.filter((sale) => {
          const saleDate = new Date(sale.datesold);
          return saleDate >= dayStartDate && saleDate <= dayEndDate;
        });

        const weekExpense = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= dayStartDate && expenseDate <= dayEndDate;
        });

        const weekTotalAmount = weekSales.reduce(
          (acc, sale) => acc + sale.total,
          0
        );
        const weekTotalCommissions = weekSales.reduce(
          (acc, sale) => acc + sale.commission,
          0
        );
        const weekTotalExpense = weekExpense.reduce(
          (acc, expense) => acc + expense.cost,
          0
        );
        const netProfit = weekTotalAmount - weekTotalExpense;
        const weekTotalProfit = netProfit > 0 ? netProfit : 0;

        weeksData[dayName] = {
          day: dayName,
          sales: weekSales.length,
          totalAmount: weekTotalAmount,
          totalProfit: weekTotalProfit,
          totalExpense: weekTotalExpense,
          totalCommission: weekTotalCommissions,
        };

        startDate.setDate(startDate.getDate() - 1);
      }

      const updatedWeekData = Object.keys(weeksData).map((dayName) => ({
        name: dayName,
        Revenue: weeksData[dayName].totalAmount,
        Profit: weeksData[dayName].totalProfit,
        Expenses: weeksData[dayName].totalExpense,
        Commissions: weeksData[dayName].totalCommission,
      }));

      setWeekData(updatedWeekData);
    },
    [currentWeekMonth, salesData, expenses]
  );

  useEffect(() => {
    if (!salesLoading && !expensesLoading) {
      weekGraph();
    }
  }, [salesData, expenses]);

  return (
    <>
      {salesLoading || expensesLoading ? (
        <Spin tip="Loading...">
          <Card title="Weekly Report">
            <div style={{ display: "flex", gap: "10px" }}>
              {" "}
              <Button
                style={{ background: "#00152a", color: "white" }}
                onClick={() => weekGraph("nextWeek")}
              >
                Next Week
              </Button>{" "}
              <Button
                style={{ background: "green", color: "white" }}
                onClick={() => weekGraph("currentWeek")}
              >
                This Week
              </Button>
              <Button
                style={{ background: "red", color: "white" }}
                onClick={() => weekGraph("lastWeek")}
              >
                Previous Week
              </Button>
            </div>

            <Divider variant="solid">Weekly Report</Divider>
          </Card>
        </Spin>
      ) : (
        <Card title="Weekly Report">
          <div style={{ display: "flex", gap: "10px" }}>
            {" "}
            <Button
              style={{ background: "#00152a", color: "white" }}
              onClick={() => weekGraph("nextWeek")}
            >
              Next Week
            </Button>{" "}
            <Button
              style={{ background: "green", color: "white" }}
              onClick={() => weekGraph("currentWeek")}
            >
              This Week
            </Button>
            <Button
              style={{ background: "red", color: "white" }}
              onClick={() => weekGraph("lastWeek")}
            >
              Previous Week
            </Button>
          </div>

          <Divider variant="solid">Weekly Report</Divider>

          <BarChart
            width={1150}
            height={400}
            data={weekData}
            margin={{ left: 38, right: 1 }}
          >
            <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" />
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
              {weekData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Revenue}
                  fill="#8884d8"
                />
              ))}
            </Bar>
            <Bar dataKey="Profit" fill="blue">
              {weekData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Profit}
                  fill="#82ca9d"
                />
              ))}
            </Bar>
            <Bar dataKey="Expenses" fill="red">
              {weekData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Expenses}
                  fill="red"
                />
              ))}
            </Bar>
            <Bar dataKey="Commissions" fill="#f0b30f">
              {weekData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Commissions}
                  fill="#f0b30f"
                />
              ))}
            </Bar>
          </BarChart>
        </Card>
      )}
    </>
  );
}

export default DashboardGraph;
