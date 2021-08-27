import React from "react";
import Heading from "../Heading";
import TimeNow from "../TimeNow";
import styles from "./styles.module.scss";

const HeadingWithTime = ({ children }) => (
  <div className={styles.heading}>
    <div className={styles.text}>
      <Heading>{children}</Heading>
    </div>
    <div className={styles.beside}>
      <TimeNow />
    </div>
  </div>
);

export default HeadingWithTime;
