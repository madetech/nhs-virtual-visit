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
          <th className="nhsuk-table__header" scope="col">
            Number of wards
          </th>
          <th className="nhsuk-table__header" scope="col">
            Booked visits
          </th>
          <th className="nhsuk-table__header" scope="col">
            <span className="nhsuk-u-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {hospitals.map((hospital) => (
          <tr key={hospital.name} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{hospital.name}</td>
            <td className="nhsuk-table__cell">{hospital.wards.length}</td>
            <td className="nhsuk-table__cell">{hospital.bookedVisits}</td>
            <td className="nhsuk-table__cell" style={{ textAlign: "center" }}>
              <AnchorLink
                href={`/trust-admin/hospitals/${hospital.id}`}
                className="nhsuk-u-margin-right-4"
              >
                View
                <span className="nhsuk-u-visually-hidden">
                  {" "}
                  {hospital.name}
                </span>
              </AnchorLink>
              <AnchorLink href={`/trust-admin/hospitals/${hospital.id}/edit`}>
                Edit
                <span className="nhsuk-u-visually-hidden">
                  {" "}
                  {hospital.name}
                </span>
              </AnchorLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HospitalsTable;
