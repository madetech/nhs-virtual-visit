import React from "react";
import AnchorLink from "../AnchorLink";

const WardsTable = ({ wards }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of wards</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Hospital name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Ward name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Ward code
          </th>
          <th className="nhsuk-table__header" scope="col"></th>
          <th className="nhsuk-table__header" scope="col"></th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {wards.map((ward) => (
          <tr key={ward.callId} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{ward.hospitalName}</td>
            <td className="nhsuk-table__cell">{ward.name}</td>
            <td className="nhsuk-table__cell">{ward.code}</td>
            <td className="nhsuk-table__cell">
              <AnchorLink href={`/trust-admin/edit-a-ward?wardId=${ward.id}`}>
                Edit
              </AnchorLink>
            </td>
            <td className="nhsuk-table__cell">
              <AnchorLink
                href={`/trust-admin/archive-a-ward-confirmation?wardId=${ward.id}`}
              >
                Delete
              </AnchorLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WardsTable;
