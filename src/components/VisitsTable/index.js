import React from "react";
import moment from "moment";
import Router from "next/router";

const formatDate = (date) => moment(date).format("D MMMM YYYY, h.mma");

const Visits = ({ id, visits }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">List of ward visits</caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Patient name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Key contact mobile number
          </th>
          <th className="nhsuk-table__header" scope="col">
            Call time
          </th>
          <th className="nhsuk-table__header" scope="col"></th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {visits.map((visit) => (
          <tr className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{visit.patientName}</td>
            <td className="nhsuk-table__cell">{visit.recipientNumber}</td>
            <td className="nhsuk-table__cell">{formatDate(visit.callTime)}</td>
            <td className="nhsuk-table__cell">
              <button
                className="nhsuk-button"
                type="submit"
                onClick={() => {
                  const patientName = visit.patientName;
                  const contactNumber = visit.recipientNumber;
                  const callDateTime = visit.callTime;
                  const callId = visit.callId;
                  Router.push({
                    pathname: `/wards/${id}/visit-start`,
                    query: { patientName, contactNumber, callDateTime, callId },
                  });
                }}
              >
                Start
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Visits;
