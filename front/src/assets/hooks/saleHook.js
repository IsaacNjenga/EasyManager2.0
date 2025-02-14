import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchSales = async () => {
      setSalesLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("sales", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setSalesData(response.data.sales);
        }
      } catch (error) {
        console.log("Error", error);
        Swal.fire({
          icon: "warning",
          title: "Could not fetch sales",
          text: "Try refreshing the page",
        });
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSales();
  }, [refreshKey]);

  return {
    salesData,
    salesLoading,
    refresh: () => setRefreshKey((prev) => prev + 1),
  };
};

export default useSales;
