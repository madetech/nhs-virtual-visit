import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { useState } from "react";
import Error from "next/error";
import { formatDate, formatTime } from "../../src/helpers/formatDatesAndTimes";
import verifyToken from "../../src/usecases/verifyToken";
import { WARD_STAFF } from "../../src/helpers/userTypes";
import { v4 as uuidv4 } from "uuid";
import fetchEndpointWithCorrelationId from "../../src/helpers/fetchEndpointWithCorrelationId";

const VisitStart = ({
  patientName,
  contactName,
  contactNumber,
  contactEmail,
  callId,
  error,
  callPassword,
  correlationId,
}) => {
  const [userError, setUserError] = useState(error);

  const startCall = async () => {
    const body = JSON.stringify({
      callUuid: callId,
      contactNumber,
      contactEmail,
      callPassword,
    });

    const response = await fetchEndpointWithCorrelationId(
      "POST",
      "/api/send-visit-ready-notification",
      body,
      correlationId
    );

    const { callUrl, err } = await response.json();

    if (callUrl) {
      window.location.href = callUrl;
    } else {
      setUserError("Unable to join video call");
      console.error(err);
    }
  };

  if (userError) {
    return <Error />;
  }

  return (
    <Layout
      title="Before handing over to the patient"
      showNavigationBarForType={WARD_STAFF}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>Before handing over to the patient</Heading>

          <p>
            The key contact has been sent a text message with instructions on
            how to attend this visit.
          </p>

          <p>Please ask the key contact to confirm the following details:</p>

          <ul>
            <li>
              Key contact name{contactName && ":"}{" "}
              <strong>{contactName}</strong>
            </li>
            <li>
              Patient name: <strong>{patientName}</strong>
            </li>
            <li>Patient&apos;s date of birth</li>
          </ul>

          <button
            className="nhsuk-button"
            type="submit"
            onClick={() =>
              startCall({
                callId,
                contactNumber,
                callPassword,
              })
            }
          >
            Attend visit
          </button>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(async ({ query, container }) => {
    const { callId } = query;

    const { visit: scheduledCall, error } = await retrieveVisitByCallId(
      container
    )(callId);

    const callTime = formatTime(scheduledCall.callTime, "HH:mm");
    const callDate = formatDate(scheduledCall.callTime);

    const correlationId = `${uuidv4()}-visit-attended`;

    return {
      props: {
        patientName: scheduledCall.patientName,
        contactName: scheduledCall.recipientName,
        contactNumber: scheduledCall.recipientNumber,
        contactEmail: scheduledCall.recipientEmail,
        callTime,
        callDate,
        callId,
        error,
        callPassword: scheduledCall.callPassword,
        correlationId,
      },
    };
  })
);

export default VisitStart;
