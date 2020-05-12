import React from "react";
import Router from "next/router";

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
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {wards.map((ward) => (
          <tr key={ward.callId} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{ward.hospitalName}</td>
            <td className="nhsuk-table__cell">{ward.name}</td>
            <td className="nhsuk-table__cell">{ward.code}</td>
            <td className="nhsuk-table__cell">
              <button
                className="nhsuk-button"
                onClick={() => {
                  const wardId = ward.id;
                  Router.push({
                    pathname: `/admin/edit-a-ward`,
                    query: { wardId },
                  });
                }}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WardsTable;
