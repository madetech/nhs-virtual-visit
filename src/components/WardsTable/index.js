import React from "react";
import AnchorLink from "../AnchorLink";
import toLowerSnake from "../../helpers/toLowerSnake";

const WardsTable = ({ wards, wardVisitTotals, hospital }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of wards</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          {!wardVisitTotals && (
            <th className="nhsuk-table__header" scope="col">
              Hospital name
            </th>
          )}
          <th className="nhsuk-table__header" scope="col">
            Ward name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Ward code
          </th>
          {wardVisitTotals && (
            <th className="nhsuk-table__header" scope="col">
              Booked visits
            </th>
          )}
          <th className="nhsuk-table__header" scope="col" colSpan="2">
            <span className="nhsuk-u-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {wards.map((ward) => (
          <tr key={ward.uuid} className="nhsuk-table__row">
            {!wardVisitTotals && (
              <td className="nhsuk-table__cell">{ward.hospitalName}</td>
            )}
            <td className="nhsuk-table__cell">{ward.name}</td>
            <td className="nhsuk-table__cell">{ward.code}</td>
            {wardVisitTotals && (
              <td className="nhsuk-table__cell">
                {wardVisitTotals[ward.uuid]}
              </td>
            )}
            <td className="nhsuk-table__cell">
              <AnchorLink
                href={`/trust-admin/hospitals/${hospital.uuid}/wards/${ward.uuid}/edit-ward`}
              >
                Edit
                <span className="nhsuk-u-visually-hidden"> {ward.name}</span>
              </AnchorLink>
            </td>
            <td className="nhsuk-table__cell">
              <AnchorLink
                data-testid={`delete-${toLowerSnake(ward.name)}`}
                href={`/trust-admin/hospitals/${hospital.uuid}/wards/${ward.uuid}/archive-ward-confirmation?hospitalName=${hospital.name}`}
              >
                Delete
                <span className="nhsuk-u-visually-hidden"> {ward.name}</span>
              </AnchorLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WardsTable;
