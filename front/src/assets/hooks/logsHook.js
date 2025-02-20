import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useLogs = () => {
  const [logins, setLogins] = useState([]);
  const [loginsLoading, setLoginsLoading] = useState(false);
  const [logouts, setLogouts] = useState([]);
  const [logoutsLoading, setLogoutsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchLogins = async () => {
      setLoginsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("logins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setLogins(response.data.logins);
        }
      } catch (error) {
        console.log("Error", error);
        Swal.fire({
          icon: "warning",
          title: "Could not fetch logs ",
          text: "Try refreshing the page",
        });
      } finally {
        setLoginsLoading(false);
      }
    };

    const fetchLogouts = async () => {
      setLogoutsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("logouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setLogouts(response.data.logouts);
        }
      } catch (error) {
        console.log("Error", error);
        Swal.fire({
          icon: "warning",
          title: "Could not fetch logs ",
          text: "Try refreshing the page",
        });
      } finally {
        setLogoutsLoading(false);
      }
    };

    fetchLogins();
    fetchLogouts();
  }, [refreshKey]);

  return {
    logins,
    loginsLoading,
    logoutsLoading,
    logouts,
    refresh: () => setRefreshKey((prev) => prev + 1),
  };
};

export default useLogs;
