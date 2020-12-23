import React from "react";

const PanelSuccess = ({ name, action, subAction }) => {
  return (
    <>
      <div
        className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
        style={{ textAlign: "center" }}
      >
        <h1
          id={`panel-${action}-success`}
          data-testid="name"
          className="nhsuk-panel__title"
        >
          {name} has been {action}
        </h1>
        <div className="nhsuk-panel__body">{subAction}</div>
      </div>
    </>
  );
};

export default PanelSuccess;
