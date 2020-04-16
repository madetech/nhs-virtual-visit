import retreiveVisits from "../../../src/usecases/retreiveVisits";
import Layout from "../../../src/components/Layout";
import Heading from "../../../src/components/Heading";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import VisitationsTable from "../../../src/components/VisitationsTable";
import pgp from "pg-promise";
import verifyToken from "../../../src/usecases/verifyToken";
import TokenProvider from "../../../src/providers/TokenProvider";
import { useState, useCallback } from "react";

export default function WardVisits({ scheduledCalls, error }) {
  const [userError, setUserError] = useState(
    error ? "Unable to display ward visitations" : null
  );

  const joinCall = async ({ contactNumber }) => {
    console.log(contactNumber);
    const response = await fetch("/api/send-visitation-ready-notification", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
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
    return (
      <Layout title="Sorry, there is a problem with the service">
        <GridRow>
          <GridColumn width="two-thirds">
            <Heading>Sorry, there is a problem with the service</Heading>
            <p className="nhsuk-body">
              We were unable to process your request, try again later.
            </p>
          </GridColumn>
        </GridRow>
      </Layout>
    );
  }

  return (
    <Layout title="Ward visitations">
      <GridRow>
        <GridColumn width="full-width">
          <Heading>Ward visitations</Heading>
          <VisitationsTable visitations={scheduledCalls} joinCall={joinCall} />
        </GridColumn>
      </GridRow>
    </Layout>
  );
}

export const getServerSideProps = verifyToken(
  async () => {
    const container = {
      getDb() {
        return pgp()({
          connectionString: process.env.URI,
          ssl: {
            rejectUnauthorized: false,
          },
        });
      },
    };

    const { scheduledCalls, error } = await retreiveVisits(container);

    return { props: { scheduledCalls, error } };
  },
  {
    tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
  }
);
