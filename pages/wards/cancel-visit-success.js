import React, { useCallback } from "react";
import Button from "../../src/components/Button";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import Router from "next/router";
import verifyToken from "../../src/usecases/verifyToken";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";
import deleteVisitByCallId from "../../src/usecases/deleteVisitByCallId";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import Error from "next/error";
import VisitSummaryList from "../../src/components/VisitSummaryList";

const deleteVisitSuccess = ({
  patientName,
  contactName,
  contactNumber,
  callDateAndTime,
  error,
  deleteError,
}) => {
  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    Router.push(`/wards/visits`);
  });

  if (error || deleteError) {
    return <Error />;
  }

  return (
    <Layout title="Virtual visit has been cancelled" renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <form onSubmit={onSubmit}>
            <Heading>Virtual visit has been cancelled</Heading>
            <p>The following virtual visit has been successfully cancelled.</p>

            <VisitSummaryList
              patientName={patientName}
              visitorName={contactName}
              visitorMobileNumber={contactNumber}
              visitDateAndTime={callDateAndTime}
            ></VisitSummaryList>

            <Button>Return to virtual visits</Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(async ({ query, container }) => {
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

    let { error: deleteError } = await deleteVisitByCallId(container)(callId);
    return {
      props: {
        patientName: scheduledCall.patientName,
        contactName: scheduledCall.recipientName,
        contactNumber: scheduledCall.recipientNumber,
        callDateAndTime: scheduledCall.callTime,
        error,
        deleteError,
      },
    };
  })
);

export default deleteVisitSuccess;
