import React from "react";
import moment from "moment";

const formatDate = (date) => moment(date).format("D MMMM YYYY, h.mma");

const Visitations = ({ visitations }) => (
  <div className="nhsuk-table-responsive">
    <table className="nhsuk-table">
      <caption className="nhsuk-table__caption">
        List of ward visitations
      </caption>
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          <th className="nhsuk-table__header" scope="col">
            Patient name
          </th>
          <th className="nhsuk-table__header" scope="col">
            Recipient mobile number
          </th>
          <th className="nhsuk-table__header" scope="col">
            Call time
          </th>
          <th className="nhsuk-table__header" scope="col"></th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {visitations.map((visitation) => (
          <tr className="nhsuk-table__row">
            <td className="nhsuk-table__cell">{visitation.patientName}</td>
            <td className="nhsuk-table__cell ">{visitation.recipientNumber}</td>
            <td className="nhsuk-table__cell ">
              {formatDate(visitation.callTime)}
            </td>
            <td className="nhsuk-table__cell ">
              <button className="nhsuk-button" type="submit">
                Join call
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Visitations;
