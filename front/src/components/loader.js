import React from "react";
import "../assets/css/loader.css";

function Loader() {
  return (
    <>
      <div className="loader-container">
        <div className="loader">
          <p>Loading...</p>
          <div className="machine-load"></div>
        </div>
      </div>
    </>
  );
}

export default Loader;
