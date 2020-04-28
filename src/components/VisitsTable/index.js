import React from "react";
import Router from "next/router";
import formatDateAndTime from "../../helpers/formatDateAndTime";

const Visits = ({ wardId, visits }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of ward visits</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Patient name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Key contact name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Key contact mobile number
          </th>
          <th className="nhsuk-table__header" scope="col">
            Call time
          </th>
          <th className="nhsuk-table__header" colspan="2" scope="col"></th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {visits.map((visit) => (
          <tr key={visit.callId} className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{visit.patientName}</td>
            <td className="nhsuk-table__cell">{visit.recipientName}</td>
            <td className="nhsuk-table__cell">{visit.recipientNumber}</td>
            <td className="nhsuk-table__cell">
              {formatDateAndTime(visit.callTime)}
            </td>
            <td className="nhsuk-table__cell">
              <button
                className="nhsuk-button"
                type="submit"
                onClick={() => {
                  const callId = visit.callId;
                  Router.push({
                    pathname: `/wards/${wardId}/visit-start`,
                    query: { callId },
                  });
                }}
              >
                Start
              </button>
            </td>
            <td className="nhsuk-table__cell">
              <button
                className="nhsuk-button nhsuk-button--secondary"
                onClick={() => {
                  const callId = visit.callId;
                  Router.push({
                    pathname: `/wards/${wardId}/cancel-visit-confirmation`,
                    query: { callId },
                  });
                }}
              >
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Visits;
