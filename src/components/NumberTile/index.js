import React from "react";
import "./styles.scss";

const NumberTitle = ({ number, label }) => (
  <div className="app-number-tile">
    {number}
    <span className="app-number-tile-label">{label}</span>
  </div>
);

export default NumberTitle;
