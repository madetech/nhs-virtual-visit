import React from "react";
import AnchorLink from "../AnchorLink";

const HospitalsTable = ({ hospitals }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of hospitals</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Name
          </th>
          <th className="nhsuk-table__header" scope="col"></th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {hospitals.map((hospital) => (
          <tr key={hospital.name} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{hospital.name}</td>
            <td className="nhsuk-table__cell" style={{ textAlign: "center" }}>
              <AnchorLink href={`/trust-admin/hospitals/${hospital.id}`}>
                View
              </AnchorLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HospitalsTable;
