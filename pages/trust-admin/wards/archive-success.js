import React from "react";
import Error from "next/error";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import AnchorLink from "../../../src/components/AnchorLink";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";
import logger from "../../../logger";
import PanelSuccess from "../../../../src/components/PanelSuccess";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
const archiveAWardSuccess = ({ name, hospitalName, hospitalId, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`${name} has been deleted`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess
            name={`${name}`}
            action={`deleted`}
            subAction={`for ${hospitalName}`}
          />
          <p>
            <AnchorLink
              href="/trust-admin/hospitals/[id]"
              as={`/trust-admin/hospitals/${hospitalId}`}
            >
              {`Return to ${hospitalName}`}
            </AnchorLink>
          </p>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ query }) => {
    logger.debug(query);

    return {
      props: {
        name: query.name,
        hospitalName: query.hospitalName,
        hospitalId: query.hospitalId,
      },
    };
  })
);

export default archiveAWardSuccess;
