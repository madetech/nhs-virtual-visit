import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import ActionLink from "../../src/components/ActionLink";
import AnchorLink from "../../src/components/AnchorLink";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import verifyToken from "../../src/usecases/verifyToken";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { WARD_STAFF } from "../../src/helpers/userTypes";

const Success = () => {
  return (
    <Layout
      title="Virtual visit booked"
      showNavigationBarForType={WARD_STAFF}
      showNavigationBar={true}
    >
      <GridRow data-testid="virtual-visit-booked">
        <GridColumn width="two-thirds">
          <Heading>Virtual visit booked</Heading>

          <Text>
            Your virtual visit has been booked and the key contact will be
            notified of their scheduled time.
          </Text>

          <ActionLink href={`/wards/book-a-visit`}>
            Book another virtual visit
          </ActionLink>

          <Text>
            <AnchorLink href="/wards/visits">View virtual visits</AnchorLink>
          </Text>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(() => {
    return { props: {} };
  })
);

export default Success;
