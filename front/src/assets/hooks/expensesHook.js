import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useExpenses = () => {
  const [expenses, setExpensesData] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpensesLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setExpensesData(response.data.expenses);
        }
      } catch (error) {
        console.log("Error", error);
        Swal.fire({
          icon: "warning",
          title: "Could not fetch expenses",
          text: "Try refreshing the page",
        });
      } finally {
        setExpensesLoading(false);
      }
    };

    fetchExpenses();
  }, [refreshKey]);

  return {
    expenses,
    expensesLoading,
    refresh: () => setRefreshKey((prev) => prev + 1),
  };
};

export default useExpenses;
