import React from "react";

const PanelUpdateSuccess = ({ name, action }) => {
  return (
    <>
      <div
        className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
        style={{ textAlign: "center" }}
      >
        <h1 data-testid="name" className="nhsuk-panel__title">
          {name} has been {action}
        </h1>
      </div>
    </>
  );
};

export default PanelUpdateSuccess;
