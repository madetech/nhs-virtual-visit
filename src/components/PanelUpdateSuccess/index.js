import React from "react";

const PanelUpdateSuccess = ({ name }) => {
  return (
    <>
      <div
        className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
        style={{ textAlign: "center" }}
      >
        <h1 data-testid="name" className="nhsuk-panel__title">
          {name} has been updated
        </h1>
      </div>
    </>
  );
};

export default PanelUpdateSuccess;
