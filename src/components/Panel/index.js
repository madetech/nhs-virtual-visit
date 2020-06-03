import React from "react";
import Text from "../Text";

const Panel = ({ title, body }) => {
  return (
    <>
      <div className="nhsuk-panel nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-0">
        <h3>{title}</h3>
        <Text>{body}</Text>
      </div>
    </>
  );
};

export default Panel;
