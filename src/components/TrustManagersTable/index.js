import React from "react";
import AnchorLink from "../AnchorLink";
import Link from "next/link";

const TrustManagersTable = ({ trustManagers }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table" id="trust-manager-table">
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
        {trustManagers?.map((info) => (
          <tr key={info.id} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{info.email}</td>
            <td className="nhsuk-table__cell">{info.status}</td>

            <td className="nhsuk-table__cell">
              <Link
                className="nhsuk-link"
                href={{
                  pathname: `/trust-admin/trust-managers/[id]/edit`,
                  query: { id: info.id },
                }}
                as={`/trust-admin/trust-managers/${info.id}/edit`}
              >
                Edit
              </Link>
            </td>
            <td className="nhsuk-table__cell">
              <AnchorLink href="">Delete</AnchorLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TrustManagersTable;
