import React from "react";
import AnchorLink from "../AnchorLink";

const ManagersTable = ({ managers }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table" id="manager-table">
      <caption className="nhsuk-table__caption">List of Trust Managers</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Email
          </th>
          <th className="nhsuk-table__header" scope="col">
            Status
          </th>
          <th className="nhsuk-table__header" scope="col" colSpan="2">
            <span className="nhsuk-u-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {managers?.map((info) => (
          <tr key={info.uuid} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{info.email}</td>
            <td className="nhsuk-table__cell">{info.status}</td>

            <td className="nhsuk-table__cell">
              <AnchorLink
                className="nhsuk-link"
                href={{
                  pathname: `/trust-admin/managers/[uuid]/edit`,
                  query: { uuid: info.uuid },
                }}
                as={`/trust-admin/managers/${info.uuid}/edit`}
                data-cy="edit-tm-link"
              >
                Edit
              </AnchorLink>
            </td>
            <td className="nhsuk-table__cell">
              <AnchorLink
                className="nhsuk-link"
                href={{
                  pathname: `/trust-admin/managers/[uuid]/archive-confirmation`,
                  query: { uuid: info.uuid },
                }}
                as={`/trust-admin/managers/${info.uuid}/archive-confirmation`}
                data-cy="delete-tm-link"
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

export default ManagersTable;
