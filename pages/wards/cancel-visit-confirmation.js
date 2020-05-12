import React, { useCallback } from "react";
import Button from "../../src/components/Button";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import Router from "next/router";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import Error from "next/error";
import VisitSummaryList from "../../src/components/VisitSummaryList";
import BackLink from "../../src/components/BackLink";

const deleteVisitConfirmation = ({
  callId,
  patientName,
  contactName,
  contactNumber,
  callDateAndTime,
  error,
}) => {
  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    Router.push(`/wards/cancel-visit-success?callId=${callId}`);
  });

  if (error) {
    return <Error />;
  }

  return (
    <Layout title="Confirm cancellation of virtual visit" renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>Confirm cancellation of virtual visit</Heading>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn width="two-thirds">
          <form onSubmit={onSubmit}>
            <VisitSummaryList
              patientName={patientName}
              visitorName={contactName}
              visitorMobileNumber={contactNumber}
              visitDateAndTime={callDateAndTime}
            ></VisitSummaryList>

            <div className="nhsuk-warning-callout">
              <h3 className="nhsuk-warning-callout__label">
                Inform key contact
              </h3>
              <p>
                It may be appropriate to inform the key contact why this virtual
                visit is being cancelled.
              </p>
            </div>

            <Button>Confirm cancellation</Button>

            <BackLink href="/wards/visits">Back to virtual visits</BackLink>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(
    async ({ query, container }) => {
      const { callId } = query;

      let { scheduledCall, error } = await retrieveVisitByCallId(container)(
        callId
      );
      if (error && !scheduledCall) {
        scheduledCall = {
          patientName: "",
          recipientName: "",
          recipientNumber: "",
          callTime: "",
        };
      }

      return {
        props: {
          patientName: scheduledCall.patientName,
          contactName: scheduledCall.recipientName,
          contactNumber: scheduledCall.recipientNumber,
          callDateAndTime: scheduledCall.callTime,
          callId,
          error,
        },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default deleteVisitConfirmation;
