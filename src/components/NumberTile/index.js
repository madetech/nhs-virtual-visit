import React from "react";
import "./styles.scss";

const NumberTitle = ({ number, label, small = false }) => (
  <div className={small ? "app-number-tile--s" : "app-number-tile"}>
    {number}
    <span className="app-number-tile-label"> {label}</span>
  </div>
);

export default NumberTitle;
