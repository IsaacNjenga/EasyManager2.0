import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

function ProtectedRoutes({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now(); // Convert exp to milliseconds

      if (isExpired) {
        localStorage.removeItem("token"); // Clear expired token

        // Show session expired alert
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });

        return <Navigate to="/login" replace />;
      }

      return children;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");

      // Show invalid token alert
      Swal.fire({
        icon: "error",
        title: "Session Error",
        text: "Your session is invalid. Please log in again.",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });

      return <Navigate to="/login" replace />;
    }
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoutes;
