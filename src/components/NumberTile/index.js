import React from "react";
import styles from "./styles.module.scss";

const NumberTitle = ({ number, label, small = false }) => (
  <div className={`${styles.tile} ${small ? styles.small : ''}`}>
    {number}
    <span className={styles.label}> {label}</span>
  </div>
);

export default NumberTitle;
