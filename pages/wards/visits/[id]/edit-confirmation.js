import React, { useCallback } from "react";
import Button from "../../../../src/components/Button";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Text from "../../../../src/components/Text";
import Heading from "../../../../src/components/Heading";
import Layout from "../../../../src/components/Layout";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import Router from "next/router";
import verifyToken from "../../../../src/usecases/verifyToken";
import VisitSummaryList from "../../../../src/components/VisitSummaryList";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import { WARD_STAFF } from "../../../../src/helpers/userTypes";

const EditAVisitConfirmation = ({
  id,
  patientName,
  contactName,
  contactNumber,
  contactEmail,
  callTime,
}) => {
  const changeLink = () => {
    const query = {
      patientName,
      contactName,
      contactNumber,
      contactEmail,
      ...callTime,
    };

    var queryParameters = Object.keys(query)
      .map((k) => {
        if (query[k] !== null && query[k] !== undefined) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]);
        }
      })
      .join("&");

    const asPath = `/wards/visits/${id}/edit?${queryParameters}`;

    Router.push("/wards/visits/[id]/edit", asPath);
  };
  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    const submitAnswers = async () => {
      let body = {
        id,
        patientName,
        contactName,
        callTime: moment(callTime),
        callTimeLocal: callTime,
      };

      if (contactNumber) {
        body.contactNumber = contactNumber;
      }
      if (contactEmail) {
        body.contactEmail = contactEmail;
      }

      const response = await fetch("/api/update-a-visit", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const { success, err } = await response.json();

      if (success) {
        Router.push(
          "/wards/visits/[id]/edit-success",
          `/wards/visits/${id}/edit-success`
        );
      } else {
        console.error(err);
      }
    };

    submitAnswers({
      contactNumber,
      contactName,
      patientName,
      callTime,
      contactEmail,
    });
  });

  return (
    <Layout
      title="Check your answers before editing a virtual visit"
      showNavigationBarForType={WARD_STAFF}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <form onSubmit={onSubmit}>
            <Heading>Check your answers before editing a virtual visit</Heading>

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
              ensure we set up the virtual visit with the correct person.
            </Text>
            <Button className="nhsuk-u-margin-top-5">Edit virtual visit</Button>
          </form>
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
        id: query.id,
        patientName,
        contactName,
        contactNumber: contactNumber || null,
        contactEmail: contactEmail || null,
        callTime,
      },
    };
  })
);

export default EditAVisitConfirmation;
