import React, { useCallback } from "react";
import Button from "../../src/components/Button";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import Router from "next/router";
import formatDate from "../../src/helpers/formatDate";
import formatTime from "../../src/helpers/formatTime";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";

const ScheduleConfirmation = ({
  id,
  patientName,
  contactName,
  contactNumber,
  callTime,
}) => {
  const changeLink = () => {
    Router.push({
      pathname: `/wards/schedule-visit`,
      query: { patientName, contactName, contactNumber, ...callTime },
    });
  };
  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    const submitAnswers = async ({
      contactName,
      contactNumber,
      patientName,
      callTime,
    }) => {
      const response = await fetch("/api/schedule-visit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contactNumber,
          patientName,
          contactName,
          callTime: moment(callTime).toISOString(true),
          callTimeLocal: callTime,
        }),
      });

      const { success, err } = await response.json();

      if (success) {
        Router.push(`/wards/schedule-success`);
      } else {
        console.error(err);
      }
    };

    submitAnswers({ contactNumber, contactName, patientName, callTime });
  });

  return (
    <Layout title="Check your answers before scheduling a virtual visit">
      <GridRow>
        <GridColumn width="two-thirds">
          <form onSubmit={onSubmit}>
            <Heading>
              Check your answers before scheduling a virtual visit
            </Heading>
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
                <dt className="nhsuk-summary-list__key">Key contact's name</dt>
                <dd className="nhsuk-summary-list__value">{contactName}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={changeLink}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      key contact's name
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">
                  Key contact's mobile number
                </dt>
                <dd className="nhsuk-summary-list__value">{contactNumber}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={changeLink}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      key contact's mobile number
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Date of call</dt>
                <dd className="nhsuk-summary-list__value">
                  {formatDate(callTime)}
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
                  {formatTime(callTime)}
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
            <Button className="nhsuk-u-margin-top-5">
              Schedule virtual visit
            </Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = verifyToken(
  ({ query, authenticationToken }) => {
    const {
      patientName,
      contactName,
      contactNumber,
      day,
      month,
      year,
      hour,
      minute,
    } = query;
    const callTime = { day, month, year, hour, minute };

    return {
      props: {
        id: authenticationToken.ward,
        patientName,
        contactName,
        contactNumber,
        callTime,
      },
    };
  },
  {
    tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
  }
);

export default ScheduleConfirmation;
