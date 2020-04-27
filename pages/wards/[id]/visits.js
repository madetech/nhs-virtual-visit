import retrieveVisits from "../../../src/usecases/retrieveVisits";
import Layout from "../../../src/components/Layout";
import Heading from "../../../src/components/Heading";
import ActionLink from "../../../src/components/ActionLink";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import VisitsTable from "../../../src/components/VisitsTable";
import Error from "next/error";
import Text from "../../../src/components/Text";
import verifyToken from "../../../src/usecases/verifyToken";
import TokenProvider from "../../../src/providers/TokenProvider";
import { useState } from "react";
import propsWithContainer from "../../../src/middleware/propsWithContainer";

export default function WardVisits({ scheduledCalls, error, id }) {
  const [userError, setUserError] = useState(
    error ? "Unable to display ward visits" : null
  );

  const joinCall = async ({ callId, contactNumber }) => {
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
    <Layout title="Ward visits" data-qa="ward-visits">
      <GridRow>
        <GridColumn width="full">
          <Heading>Ward visits</Heading>
          <h2 className="nhsuk-heading-l">Schedule a new visit</h2>
          <Text>
            You'll need the mobile number of your patient's loved one in order
            to set up a visit.
          </Text>
          <ActionLink href={`/wards/${id}/schedule-visit`}>
            Schedule visit
          </ActionLink>
          <h2 className="nhsuk-heading-l">Pre-booked visits</h2>
          {scheduledCalls.length > 0 ? (
            <VisitsTable visits={scheduledCalls} joinCall={joinCall} />
          ) : (
            <Text>There are no upcoming visits.</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
}

export const getServerSideProps = propsWithContainer(
  verifyToken(
    async ({ query: { id }, container }) => {
      const { scheduledCalls, error } = await retrieveVisits(container);

      return { props: { scheduledCalls, error, id } };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);
