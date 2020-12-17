import React from "react";
import "./styles.scss";
import Router from "next/router";
import formatDateAndTime from "../../helpers/formatDatesAndTimes";
import VisitSummaryList from "../VisitSummaryList";
import TimeFromNow from "../TimeFromNow";
import Text from "../Text";
import { COMPLETE } from "../../helpers/visitStatus";

const VisitsPanelList = ({ visits, title, showButtons }) => {
  if (visits.length != 0) {
    return (
      <div className="nhsuk-list-panel nhsuk-u-margin-0">
        <h3
          className="nhsuk-list-panel__label"
          style={{ fontSize: "1.5rem" }}
          id="A"
        >
          {title}
        </h3>
        <ul className="nhsuk-list-panel__list nhsuk-list-panel__list--with-label">
          {visits.map((visit) => (
            <li className="nhsuk-list-panel__item" key={visit.callId}>
              <div className="app-visit-card">
                <div className="app-visit-card-body">
                  <details
                    className="nhsuk-details nhsuk-u-margin-0"
                    data-testid={`details-summary-${visit.patientName}`}
                    nhsuk-polyfilled="true"
                    id="nhsuk-details0"
                  >
                    <summary
                      className="nhsuk-details__summary"
                      role="button"
                      aria-controls="nhsuk-details__text0"
                      tabIndex="0"
                      aria-expanded="false"
                    >
                      <span className="nhsuk-details__summary-text">
                        {formatDateAndTime(visit.callTime, "HH:mm")} -{" "}
                        {visit.patientName}
                        {visit.status == COMPLETE && " (Complete)"}
                      </span>
                    </summary>
                    <div
                      className="nhsuk-details__text"
                      id="nhsuk-details__text0"
                      aria-hidden="true"
                    >
                      <VisitSummaryList
                        patientName={visit.patientName}
                        visitorName={visit.recipientName}
                        visitorMobileNumber={visit.recipientNumber}
                        visitorEmailAddress={visit.recipientEmail}
                        visitDateAndTime={visit.callTime}
                        withActions={false}
                      ></VisitSummaryList>

                      {showButtons && (
                        <>
                          <button
                            className="nhsuk-button nhsuk-u-margin-right-5 nhsuk-u-margin-bottom-4"
                            type="submit"
                            onClick={() => {
                              const callId = visit.callId;
                              Router.push({
                                pathname: `/wards/visit-start`,
                                query: { callId },
                              });
                            }}
                          >
                            Start
                          </button>

                          <button
                            data-testid={`edit-visit-button-${visit.patientName}`}
                            className="nhsuk-button nhsuk-u-margin-right-5 nhsuk-button--secondary"
                            onClick={() => {
                              Router.push(
                                "/wards/visits/[id]/edit",
                                `/wards/visits/${visit.id}/edit`
                              );
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="nhsuk-button nhsuk-u-margin-right-5 nhsuk-button--secondary"
                            onClick={() => {
                              const callId = visit.callId;
                              Router.push({
                                pathname: `/wards/book-a-visit`,
                                query: { rebookCallId: callId },
                              });
                            }}
                          >
                            Rebook
                          </button>

                          <button
                            className="nhsuk-button nhsuk-button--secondary"
                            onClick={() => {
                              const callId = visit.callId;
                              Router.push({
                                pathname: `/wards/cancel-visit-confirmation`,
                                query: { callId },
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </details>
                </div>
                <div className="app-visit-card-beside">
                  <p>
                    <b>
                      <TimeFromNow dateAndTime={visit.callTime} />
                    </b>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="nhsuk-list-panel nhsuk-u-margin-0">
        <h3
          className="nhsuk-list-panel__label"
          style={{ fontSize: "1.5rem" }}
          id="A"
        >
          {title}
        </h3>
        <ul className="nhsuk-list-panel__list nhsuk-list-panel__list--with-label">
          <li className="nhsuk-list-panel__item">
            <div className="app-visit-card">
              <div className="app-visit-card-body">
                <Text className="nhsuk-u-margin-bottom-0">
                  There are no virtual visits.
                </Text>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
};

export default VisitsPanelList;
