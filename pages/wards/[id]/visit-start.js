import React, { useCallback } from "react";
import Button from "../../../src/components/Button";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Text from "../../../src/components/Text";
import Heading from "../../../src/components/Heading";
import Layout from "../../../src/components/Layout";
import retrieveVisitByCallId from "../../../src/usecases/retrieveVisitByCallId";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import Router from "next/router";
import { useState } from "react";
import Error from "next/error";

const VisitStart = ({
  id,
  patientName,
  contactNumber,
  callDate,
  callTime,
  callId,
  error,
}) => {
  const [userError, setUserError] = useState(error);

  const startCall = async ({ callId, contactNumber }) => {
    const response = await fetch("/api/send-visit-ready-notification", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        callId,
        contactNumber,
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
    <Layout title="Pre Call Checklist">
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>Virtual visit checklist</Heading>
          <p>You have started a virtual visit.</p>
          <p>
            The key contact will receive a text message with instructions on how
            to join this visit.
          </p>
          <p>
            Before handing over to the patient, please confirm they are the
            correct person. Please ask the key contact to confirm the following
            details of the patient:
          </p>
          <ul>
            <li>Key contact name</li>
            <li>
              Patient name: <strong>{patientName}</strong>
            </li>
            <li>Patient's date of birth</li>
          </ul>

          <button
            className="nhsuk-button"
            type="submit"
            onClick={() =>
              startCall({
                callId,
                contactNumber,
              })
            }
          >
            Start visit
          </button>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  async ({ query, container }) => {
    console.log("vs-query", query);
    const { id, callId } = query;

    const { scheduledCall, error } = await retrieveVisitByCallId(container)(
      callId
    );

    const callTime = moment(scheduledCall.callTime).format("h.mma");
    const callDate = moment(scheduledCall.callTime).format("D MMMM YYYY");
    return {
      props: {
        id,
        patientName: scheduledCall.patientName,
        contactNumber: scheduledCall.recipientNumber,
        callTime,
        callDate,
        callId,
        error,
      },
    };
  }
);

export default VisitStart;
