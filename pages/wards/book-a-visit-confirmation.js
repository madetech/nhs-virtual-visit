import React from "react";
import Button from "../../src/components/Button";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import Form from "../../src/components/Form";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import Router from "next/router";
import verifyToken from "../../src/usecases/verifyToken";
import VisitSummaryList from "../../src/components/VisitSummaryList";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { WARD_STAFF } from "../../src/helpers/userTypes";

const ScheduleConfirmation = ({
  patientName,
  contactName,
  contactNumber,
  contactEmail,
  callTime,
}) => {
  const changeLink = () => {
    Router.push({
      pathname: `/wards/book-a-visit`,
      query: {
        patientName,
        contactName,
        contactNumber: contactNumber || "",
        contactEmail: contactEmail || "",
        ...callTime,
      },
    });
  };
  const onSubmit = async () => {
    const submitAnswers = async () => {
      let body = {
        patientName,
        contactName,
        callTime: moment(callTime).toISOString(true),
        callTimeLocal: callTime,
      };

      if (contactNumber) {
        body.contactNumber = contactNumber;
      }
      if (contactEmail) {
        body.contactEmail = contactEmail;
      }

      const response = await fetch("/api/book-a-visit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const { success, err } = await response.json();

      if (success) {
        Router.push(`/wards/book-a-visit-success`);
        return true;
      } else {
        console.error(err);
      }

      return false;
    };

    return submitAnswers({
      contactNumber,
      contactName,
      patientName,
      callTime,
      contactEmail,
    });
  };

  return (
    <Layout
      title="Check your answers before booking a virtual visit"
      showNavigationBarForType={WARD_STAFF}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <Form onSubmit={onSubmit}>
            <Heading>Check your answers before booking a virtual visit</Heading>

            <VisitSummaryList
              patientName={patientName}
              visitorName={contactName}
              visitorMobileNumber={contactNumber}
              visitorEmailAddress={contactEmail}
              visitDateAndTime={callTime}
              withActions={true}
              actionLinkOnClick={changeLink}
            ></VisitSummaryList>

            <h2 className="nhsuk-heading-l">Key contact&apos;s information</h2>
            <Text>
              Please double check the contact information of the key contact to
              ensure we set up the virtual visit with the correct person. A
              confirmation will be sent to them once you&apos;ve booked the
              visit.
            </Text>
            <Button
              data-testid="book-virtual-visit"
              className="nhsuk-u-margin-top-5"
            >
              Book virtual visit
            </Button>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(({ query }) => {
    const {
      patientName,
      contactName,
      contactNumber,
      contactEmail,
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
        contactNumber: contactNumber || null,
        contactEmail: contactEmail || null,
        callTime,
      },
    };
  })
);

export default ScheduleConfirmation;
