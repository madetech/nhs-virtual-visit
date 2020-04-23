import React, { useCallback } from "react";
import Button from "../../../src/components/Button";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Text from "../../../src/components/Text";
import Heading from "../../../src/components/Heading";
import Layout from "../../../src/components/Layout";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import Router from "next/router";

const ScheduleConfirmation = ({ id, patientName, contactNumber, callTime }) => {
  const changeLink = () => {
    Router.push({
      pathname: `/wards/${id}/schedule-visit`,
      query: { patientName, contactNumber, ...callTime },
    });
  };
  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    const submitAnswers = async ({ contactNumber, patientName, callTime }) => {
      const response = await fetch("/api/schedule-visit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contactNumber,
          patientName,
          callTime: moment(callTime).toISOString(true),
          callTimeLocal: callTime,
        }),
      });

      const { success, err } = await response.json();

      if (success) {
        Router.push(`/wards/${id}/schedule-success`);
      } else {
        console.error(err);
      }
    };

    submitAnswers({ contactNumber, patientName, callTime });
  });

  return (
    <Layout title="Check your answers before scheduling a visit">
      <GridRow>
        <GridColumn width="two-thirds">
          <form onSubmit={onSubmit}>
            <Heading>Check your answers before scheduling a visit</Heading>
            <dl className="nhsuk-summary-list">
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Patient's name</dt>
                <dd className="nhsuk-summary-list__value">{patientName}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={changeLink}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      patient's name
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">
                  Key contact mobile number
                </dt>
                <dd className="nhsuk-summary-list__value">{contactNumber}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={changeLink}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      key contact number
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Date of call</dt>
                <dd className="nhsuk-summary-list__value">
                  {moment(callTime).format("D MMMM YYYY")}
                </dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={changeLink}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      date of call
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Time of call</dt>
                <dd className="nhsuk-summary-list__value">
                  {moment(callTime).format("hh:mma")}
                </dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={changeLink}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      date of call
                    </span>
                  </a>
                </dd>
              </div>
            </dl>
            <h2 className="nhsuk-heading-l">Key contact's mobile number</h2>
            <Text>
              We recommend you double check the mobile number of the key contact
              to ensure we setup the virtual visit with the correct person.
              We'll send them a text message once you've scheduled the visit.
            </Text>
            <Button className="nhsuk-u-margin-top-5">Schedule visit</Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = ({ query }) => {
  const {
    patientName,
    contactNumber,
    id,
    day,
    month,
    year,
    hour,
    minute,
  } = query;
  const callTime = { day, month, year, hour, minute };

  return {
    props: {
      id,
      patientName,
      contactNumber,
      callTime,
    },
  };
};

export default ScheduleConfirmation;
