import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import ActionLink from "../../src/components/ActionLink";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";

const Success = () => {
  return (
    <Layout title="Virtual visit booked">
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>Virtual visit booked</Heading>

          <Text>
            Your virtual visit has been booked and the key contact has been sent
            a text message with their scheduled time.
          </Text>

          <ActionLink href={`/wards/schedule-visit`}>
            Schedule another virtual visit
          </ActionLink>
          <ActionLink href={`/wards/visits`}>View virtual visits</ActionLink>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = verifyToken(
  () => {
    return { props: {} };
  },
  {
    tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
  }
);

export default Success;
