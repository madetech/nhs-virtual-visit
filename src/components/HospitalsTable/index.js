import React from "react";
import AnchorLink from "../AnchorLink";
import toLowerSnake from "../../helpers/toLowerSnake";

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
            Code
          </th>
          <th className="nhsuk-table__header" scope="col">
            Number of wards
          </th>
          <th className="nhsuk-table__header" scope="col">
            Booked visits
          </th>
          <th className="nhsuk-table__header" scope="col" colSpan="2">
            <span className="nhsuk-u-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {hospitals.map((hospital) => (
          <tr key={hospital.uuid} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{hospital.name}</td>
            <td className="nhsuk-table__cell">{hospital.code}</td>
            <td className="nhsuk-table__cell">{hospital.departments.length}</td>
            <td className="nhsuk-table__cell">{hospital.bookedVisits}</td>
            <td className="nhsuk-table__cell">
              <AnchorLink
                href="/trust-admin/hospitals/[hospitalUuid]"
                as={`/trust-admin/hospitals/${hospital.uuid}`}
              >
                View
                <span className="nhsuk-u-visually-hidden">
                  {" "}
                  {hospital.name}
                </span>
              </AnchorLink>
            </td>
            <td className="nhsuk-table__cell">
              <AnchorLink
                href="/trust-admin/hospitals/[hospitalUuid]/edit-hospital"
                as={`/trust-admin/hospitals/${hospital.uuid}/edit-hospital`}
                data-testid={`edit-${toLowerSnake(hospital.name)}`}
              >
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
