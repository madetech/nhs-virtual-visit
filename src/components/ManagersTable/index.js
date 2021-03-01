import React from "react";
import AnchorLink from "../AnchorLink";

const ManagersTable = ({ managers, currentManagerId }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table" id="manager-table">
      <caption className="nhsuk-table__caption">List of Managers</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Email
          </th>
          <th className="nhsuk-table__header" scope="col" colSpan="2">
            <span className="nhsuk-u-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {managers?.map((manager) => (
          <tr key={manager.uuid} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{manager.email}</td>
            <td className="nhsuk-table__cell">
              { manager.id !== currentManagerId && currentManagerId &&
              <AnchorLink
                className="nhsuk-link"
                href={{
                  pathname: `/trust-admin/managers/[uuid]/archive-confirmation`,
                  query: { uuid: manager.uuid },
                }}
                as={`/trust-admin/managers/${manager.uuid}/archive-confirmation`}
                data-cy="delete-tm-link"
              >
                Delete
              </AnchorLink>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ManagersTable;
