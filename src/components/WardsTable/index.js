import React from "react";
import AnchorLink from "../AnchorLink";

const WardsTable = ({ wards, wardVisitTotals }) => (
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
          <th className="nhsuk-table__header" scope="col">
            <span className="nhsuk-u-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {wards.map((ward) => (
          <tr key={ward.callId} className="nhsuk-table__row">
            {!wardVisitTotals && (
              <td className="nhsuk-table__cell">{ward.hospitalName}</td>
            )}
            <td className="nhsuk-table__cell">{ward.name}</td>
            <td className="nhsuk-table__cell">{ward.code}</td>
            {wardVisitTotals && (
              <td className="nhsuk-table__cell">{wardVisitTotals[ward.id]}</td>
            )}
            <td className="nhsuk-table__cell" style={{ textAlign: "center" }}>
              <AnchorLink
                href={`/trust-admin/edit-a-ward?wardId=${ward.id}`}
                className="nhsuk-u-margin-right-4"
              >
                Edit
                <span className="nhsuk-u-visually-hidden"> {ward.name}</span>
              </AnchorLink>
              <AnchorLink
                href={`/trust-admin/archive-a-ward-confirmation?wardId=${ward.id}`}
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
