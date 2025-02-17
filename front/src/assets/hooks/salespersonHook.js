import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function UseSalesperson() {
  const [salespersonData, setSalespersonData] = useState([]);
  const [salespersonLoading, setSalespersonLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchSalesperson = async () => {
    setSalespersonLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("salespersons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSalespersonData(response.data.salespersons);
      }
    } catch (error) {
      console.log("Error fetching:", error);
      Swal.fire({
        icon: "warning",
        title: "Error fetching Salespersons Data",
        text: "Tryi refreshing the page",
      });
    } finally {
      setSalespersonLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesperson();
  }, [refreshKey]);

  return {
    salespersonData,
    salespersonLoading,
    refresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default UseSalesperson;
