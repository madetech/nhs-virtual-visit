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
            Number of wards
          </th>
          <th className="nhsuk-table__header" scope="col">
            Booked visits
          </th>
          <th className="nhsuk-table__header" scope="col">
            Survey URL
          </th>
          <th className="nhsuk-table__header" scope="col">
            Support URL
          </th>
          <th className="nhsuk-table__header" scope="col" colSpan="2">
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
            <td className="nhsuk-table__cell">
              {hospital.surveyUrl ? (
                <a href={hospital.surveyUrl}>
                  Link
                  <span className="nhsuk-u-visually-hidden">
                    {" "}
                    for {hospital.name} survey
                  </span>
                </a>
              ) : (
                "None"
              )}
            </td>
            <td className="nhsuk-table__cell">
              {hospital.supportUrl ? (
                <a href={hospital.supportUrl}>
                  Link
                  <span className="nhsuk-u-visually-hidden">
                    {" "}
                    for {hospital.name} support
                  </span>
                </a>
              ) : (
                "None"
              )}
            </td>
            <td className="nhsuk-table__cell">
              <AnchorLink
                href="/trust-admin/hospitals/[id]"
                as={`/trust-admin/hospitals/${hospital.id}`}
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
                href="/trust-admin/hospitals/[id]/edit"
                as={`/trust-admin/hospitals/${hospital.id}/edit`}
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
