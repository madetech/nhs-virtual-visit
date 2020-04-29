import React, { useCallback } from "react";
import Button from "../../src/components/Button";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import Router from "next/router";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";
import deleteVisitByCallId from "../../src/usecases/deleteVisitByCallId";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { useState } from "react";
import Error from "next/error";

import formatDate from "../../src/helpers/formatDate";
import formatTime from "../../src/helpers/formatTime";

const deleteVisitSuccess = ({
  patientName,
  contactName,
  contactNumber,
  callTime,
  callDate,
  error,
  deleteError,
}) => {
  const [hasError, setHasError] = useState(error);
  const [hasDeleteError, setHasDeleteError] = useState(deleteError);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    Router.push(`/wards/visits`);
  });

  if (hasError || hasDeleteError) {
    return <Error />;
  }

  return (
    <Layout title="Virtual visit has been cancelled">
      <GridRow>
        <GridColumn width="full">
          <form onSubmit={onSubmit}>
            <Heading>Virtual visit has been cancelled</Heading>
            <p>The following virtual visit has been successfully cancelled.</p>
            <dl className="nhsuk-summary-list">
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Patient's name</dt>
                <dd className="nhsuk-summary-list__value">{patientName}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Key contact's name</dt>
                <dd className="nhsuk-summary-list__value">{contactName}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">
                  Key contact's mobile number
                </dt>
                <dd className="nhsuk-summary-list__value">{contactNumber}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Date of call</dt>
                <dd className="nhsuk-summary-list__value">{callDate}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Time of call</dt>
                <dd className="nhsuk-summary-list__value">{callTime}</dd>
              </div>
            </dl>
            <Button>Return to virtual visits</Button>
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

      const callTime = formatTime(scheduledCall.callTime);
      const callDate = formatDate(scheduledCall.callTime);

      let { success, error: deleteError } = await deleteVisitByCallId(
        container
      )(callId);
      return {
        props: {
          patientName: scheduledCall.patientName,
          contactName: scheduledCall.recipientName,
          contactNumber: scheduledCall.recipientNumber,
          callTime,
          callDate,
          error,
          deleteError,
        },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default deleteVisitSuccess;
