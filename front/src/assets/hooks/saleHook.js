import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useSales = (page, limit) => {
  const [salesData, setSalesData] = useState([]); // Stores all sales
  const [pagedSales, setPagedSales] = useState([]); // Stores paginated sales
  const [salesLoading, setSalesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchSomeSales = async () => {
    setSalesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/page-sales?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPagedSales((prev) => {
          const uniqueSales = [...prev, ...response.data.someSales].filter(
            (sale, index, arr) => arr.findIndex((s) => s._id === sale._id) === index
          );
          return uniqueSales;
        });
        setHasMore(response.data.hasMore); // Use the correct hasMore flag from API
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

  const fetchSales = async () => {
    setSalesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/sales`, {
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

  useEffect(() => {
    fetchSomeSales(); // Fetch paginated sales
  }, [page, refreshKey]);

  useEffect(() => {
    fetchSales(); // Fetch all sales, but only once
  }, []);

  return {
    salesData,
    pagedSales,
    salesLoading,
    refresh: () => setRefreshKey((prev) => prev + 1),
    hasMore,
  };
};

export default useSales;
