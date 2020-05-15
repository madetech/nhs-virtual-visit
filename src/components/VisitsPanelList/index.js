import React from "react";
import Router from "next/router";
import "./styles.scss";
import formatDateAndTime from "../../helpers/formatDateAndTime";

const Visits = ({visits}) => (
  <div className="nhsuk-list-panel nhsuk-u-margin-0">
    <h3 className="nhsuk-list-panel__label" style={{fontSize: "1.5rem"}} id="A">Next</h3>
    <ul className="nhsuk-list-panel__list nhsuk-list-panel__list--with-label">
    {visits.map((visit) => (
      <li className="nhsuk-list-panel__item">
        <div className="app-visit-card">
          <div className="app-visit-card-body">
            <details className="nhsuk-details nhsuk-u-margin-0" nhsuk-polyfilled="true" id="nhsuk-details0">
              <summary className="nhsuk-details__summary" role="button" aria-controls="nhsuk-details__text0"
                       tabIndex="0" aria-expanded="false">
                        <span className="nhsuk-details__summary-text">
                          11:45 - Steven Universe
                        </span>
              </summary>
              <div className="nhsuk-details__text" id="nhsuk-details__text0" aria-hidden="true">
                <h4>Visitor</h4>

                <dl className="nhsuk-summary-list">

                  <div className="nhsuk-summary-list__row">
                    <dt className="nhsuk-summary-list__key">
                      Name
                    </dt>
                    <dd className="nhsuk-summary-list__value">
                      Pink Diamond
                    </dd>

                  </div>

                  <div className="nhsuk-summary-list__row">
                    <dt className="nhsuk-summary-list__key">
                      Mobile number
                    </dt>
                    <dd className="nhsuk-summary-list__value">
                      0712345679
                    </dd>

                  </div>

                </dl>


                <h4>Virtual visit</h4>

                <dl className="nhsuk-summary-list">

                  <div className="nhsuk-summary-list__row">
                    <dt className="nhsuk-summary-list__key">
                      Date
                    </dt>
                    <dd className="nhsuk-summary-list__value">
                      25 April 2020
                    </dd>

                  </div>

                  <div className="nhsuk-summary-list__row">
                    <dt className="nhsuk-summary-list__key">
                      Time
                    </dt>
                    <dd className="nhsuk-summary-list__value">
                      11:45
                    </dd>

                  </div>

                </dl>


                <a href="/wards/visits/start"
                   className="nhsuk-button nhsuk-u-margin-right-5 nhsuk-u-margin-bottom-4">
                  Start visit
                </a>

                <a href="/wards/visits/cancel" className="nhsuk-button app-button--red">
                  Cancel visit
                </a>
              </div>
            </details>
          </div>
          <div className="app-visit-card-beside">
            <p>
              <b>in 22 minutes</b>
            </p>
          </div>
        </div>
      </li>
    ))}
  </ul>
  </div>
);
export default Visits;
