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

          <ActionLink href={`/wards/book-a-visit`}>
            Book another virtual visit
          </ActionLink>

          <Text>
            <a href={`/wards/visits`} className="nhsuk-link">
              View virtual visits
            </a>
          </Text>
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
