import React from "react";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import ActionLink from "../../../../src/components/ActionLink";
import AnchorLink from "../../../../src/components/AnchorLink";
import Layout from "../../../../src/components/Layout";
import Text from "../../../../src/components/Text";
import verifyToken from "../../../../src/usecases/verifyToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import { WARD_STAFF } from "../../../../src/helpers/userTypes";

const EditVisitSuccess = () => (
  <Layout
    title="Virtual visit has been updated"
    showNavigationBar={true}
    showNavigationBarForType={WARD_STAFF}
  >
    <GridRow>
      <GridColumn width="two-thirds">
        <div
          className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
          style={{ textAlign: "center" }}
        >
          <h1 className="nhsuk-panel__title">Virtual visit has been updated</h1>
        </div>

        <h2>What happens next</h2>

        <Text>
          The key contact will be notified of changes to the date or time of the
          virtual visit.
        </Text>

        <ActionLink href={`/wards/book-a-visit`}>
          Book a virtual visit
        </ActionLink>
        <p>
          <AnchorLink href="/wards/visits">Return to virtual visits</AnchorLink>
        </p>
      </GridColumn>
    </GridRow>
  </Layout>
);

export const getServerSideProps = propsWithContainer(
  verifyToken(() => {
    return {
      props: {},
    };
  })
);

export default EditVisitSuccess;
