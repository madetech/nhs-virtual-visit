import React from "react";
import verifyTrustAdminToken from "../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../src/middleware/propsWithContainer";
import Layout from "../src/components/Layout";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import Text from "../src/components/Text";

const Performance = ({ visitsScheduled }) => (
  <Layout title="Virtual Visits performance dashboard">
    <GridRow>
      <GridColumn width="full">
        <Heading>Virtual Visits performance dashboard</Heading>
        <Text>There have been {visitsScheduled} visits scheduled</Text>
      </GridColumn>
    </GridRow>
  </Layout>
);

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container }) => {
    const retrieveWardVisitTotals = container.getRetrieveDepartmentVisitTotals();
    const wardVisitTotals = await retrieveWardVisitTotals();

    return {
      props: { visitsScheduled: wardVisitTotals.total },
    };
  })
);

export default Performance;
