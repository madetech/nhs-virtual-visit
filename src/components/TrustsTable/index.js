import React from "react";

const TrustsTable = ({ trusts }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of trusts</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Trust name
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {trusts.map((trust) => (
          <tr key={trust.callId} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{trust.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TrustsTable;
