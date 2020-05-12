import React, { useCallback } from "react";
import Button from "../../src/components/Button";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import Router from "next/router";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";
import VisitSummaryList from "../../src/components/VisitSummaryList";

const ScheduleConfirmation = ({
  patientName,
  contactName,
  contactNumber,
  callTime,
}) => {
  const changeLink = () => {
    Router.push({
      pathname: `/wards/book-a-visit`,
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
      const response = await fetch("/api/book-a-visit", {
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
        Router.push(`/wards/book-a-visit-success`);
      } else {
        console.error(err);
      }
    };

    submitAnswers({ contactNumber, contactName, patientName, callTime });
  });

  return (
    <Layout
      title="Check your answers before booking a virtual visit"
      renderLogout={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <form onSubmit={onSubmit}>
            <Heading>Check your answers before booking a virtual visit</Heading>

            <VisitSummaryList
              patientName={patientName}
              visitorName={contactName}
              visitorMobileNumber={contactNumber}
              visitDateAndTime={callTime}
              withActions={true}
              actionLinkOnClick={changeLink}
            ></VisitSummaryList>

            <h2 className="nhsuk-heading-l">
              Key contact&apos;s mobile number
            </h2>
            <Text>
              Please double check the mobile number of the key contact to ensure
              we set up the virtual visit with the correct person. A text
              message will be sent to them once you&apos;ve booked the visit.
            </Text>
            <Button className="nhsuk-u-margin-top-5">Book virtual visit</Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = verifyToken(
  ({ query }) => {
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
