import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import fetch from "isomorphic-unfetch";
import { useState } from "react";
import Error from "next/error";
import formatDate from "../../src/helpers/formatDate";
import formatTime from "../../src/helpers/formatTime";
import verifyToken from "../../src/usecases/verifyToken";
import { WARD_STAFF } from "../../src/helpers/userTypes";

const VisitStart = ({
  patientName,
  contactName,
  contactNumber,
  contactEmail,
  callId,
  error,
  callPassword,
  showNavigationBar,
}) => {
  const [userError, setUserError] = useState(error);

  const startCall = async () => {
    const response = await fetch("/api/send-visit-ready-notification", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        callId,
        contactNumber,
        contactEmail,
        callPassword,
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

  return (
    <Layout
      title="Before handing over to the patient"
      showNavigationBarForType={WARD_STAFF}
      renderLogout={true}
      showNavigationBar={showNavigationBar}
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

    const { scheduledCall, error } = await retrieveVisitByCallId(container)(
      callId
    );

    const callTime = formatTime(scheduledCall.callTime, "HH:mm");
    const callDate = formatDate(scheduledCall.callTime);
    const showNavigationBar = process.env.SHOW_NAVIGATION_BAR === "yes";

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
        showNavigationBar,
      },
    };
  })
);

export default VisitStart;
