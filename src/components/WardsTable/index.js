import React from "react";
import AnchorLink from "../AnchorLink";
import toLowerSnake from "../../helpers/toLowerSnake";

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
          <th className="nhsuk-table__header" scope="col">
            Ward status
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
          <tr key={ward.id} className="nhsuk-table__row">
            {!wardVisitTotals && (
              <td className="nhsuk-table__cell">{ward.hospitalName}</td>
            )}
            <td className="nhsuk-table__cell">{ward.name}</td>
            <td className="nhsuk-table__cell">{ward.code}</td>
            <td className="nhsuk-table__cell">{ward.status}</td>
            {wardVisitTotals && (
              <td className="nhsuk-table__cell">{wardVisitTotals[ward.id]}</td>
            )}
            <td className="nhsuk-table__cell">
              <AnchorLink
                href={{
                  pathname: `/trust-admin/wards/[id]/edit`,
                  query: { id: ward.id },
                }}
                as={`/trust-admin/wards/${ward.id}/edit`}
              >
                Edit
                <span className="nhsuk-u-visually-hidden"> {ward.name}</span>
              </AnchorLink>
            </td>
            <td className="nhsuk-table__cell">
              <AnchorLink
                data-testid={`delete-${toLowerSnake(ward.name)}`}
                href={"/trust-admin/wards/[id]/archive-confirmation"}
                as={`/trust-admin/wards/${ward.id}/archive-confirmation`}
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
