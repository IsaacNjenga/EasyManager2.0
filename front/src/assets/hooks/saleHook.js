import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useSales = (page, limit) => {
  const [salesData, setSalesData] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      setSalesLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`sales?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setSalesData((prev) => {
            const uniqueSales = [...prev, ...response.data.sales].reduce(
              (acc, sale) => {
                if (!acc.some((item) => item._id === sale._id)) {
                  acc.push(sale);
                }
                return acc;
              },
              []
            );
            return uniqueSales;
          });

          setHasMore(response.data.sales.length === limit); // Only stop if less than limit
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
  }, [refreshKey, page]);

  return {
    salesData,
    salesLoading,
    refresh: () => setRefreshKey((prev) => prev + 1),
    hasMore,
  };
};

export default useSales;
