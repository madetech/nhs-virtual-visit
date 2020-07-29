import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import fetch from "isomorphic-unfetch";
import { useState } from "react";
import Error from "next/error";
import verifyToken from "../../src/usecases/verifyToken";
import { WARD_STAFF } from "../../src/helpers/userTypes";

const VisitStart = ({ scheduledCall, callId, error }) => {
  const [userError, setUserError] = useState(error);

  const startCall = async () => {
    const response = await fetch("/api/send-visit-ready-notification", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        callId,
        contactNumber: scheduledCall.recipientNumber,
        contactEmail: scheduledCall.recipientEmail,
        callPassword: scheduledCall.callPassword,
      }),
    });

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

  if (!scheduledCall) {
    return <Error statusCode={404} />;
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
              Key contact name{scheduledCall.contactName && ":"}{" "}
              <strong>{scheduledCall.contactName}</strong>
            </li>
            <li>
              Patient name: <strong>{scheduledCall.patientName}</strong>
            </li>
            <li>Patient&apos;s date of birth</li>
          </ul>

          <button
            className="nhsuk-button"
            type="submit"
            onClick={() =>
              startCall({
                callId,
                contactNumber: scheduledCall.recipientNumber,
                callPassword: scheduledCall.callPassword,
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

    const { scheduledCall, error } = await retrieveVisitByCallId(container)(
      callId
    );

    return {
      props: {
        scheduledCall,
        callId,
        error,
      },
    };
  })
);

export default VisitStart;
