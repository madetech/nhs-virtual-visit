import React from "react";

const WardsTable = ({ wards }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of wards</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Hospital Name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Ward Name
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {wards.map((ward) => (
          <tr key={ward.callId} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{ward.hospitalName}</td>
            <td className="nhsuk-table__cell">{ward.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WardsTable;
