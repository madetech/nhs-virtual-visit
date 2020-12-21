import React from "react";
import AnchorLink from "../AnchorLink";

const TrustsTable = ({ trusts }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of trusts</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Trust name
          </th>
          <th className="nhsuk-table__header" scope="col" colSpan="2">
            <span className="nhsuk-u-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {trusts.map((trust) => {
          const trustKey = trust.name.toLowerCase().replace(/\W+/g, "-");

          return (
            <tr
              key={trustKey}
              className="nhsuk-table__row"
              data-testid={trustKey}
            >
              <td className="nhsuk-table__cell">{trust.name}</td>
              <td className="nhsuk-table__cell" style={{ textAlign: "center" }}>
                <AnchorLink
                  href="/admin/trusts/[id]/edit"
                  as={`/admin/trusts/${trust.id}/edit`}
                >
                  Edit
                  <span className="nhsuk-u-visually-hidden"> {trust.name}</span>
                </AnchorLink>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default TrustsTable;
