import React from "react";
import Heading from "../Heading";
import TimeNow from "../TimeNow";
import "./styles.scss";

const HeadingWithTime = ({ children }) => (
  <div className="app-heading-with-time">
    <div className="app-heading-with-time-text">
      <Heading>{children}</Heading>
    </div>
    <div className="app-heading-with-time-beside">
      <TimeNow />
    </div>
  </div>
);

export default HeadingWithTime;
