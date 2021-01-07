import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import AnchorLink from "../../../../src/components/AnchorLink";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import PanelSuccess from "../../../../src/components/PanelSuccess";

const archiveAManagerSuccess = ({ trust, managerEmail, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`${managerEmail} has been deleted`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading="Managers" />
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess name={`${managerEmail}`} action="deleted" />
          <p>
            <AnchorLink
              href="/trust-admin/managers"
              as={`/trust-admin/managers`}
            >
              Return to Managers
            </AnchorLink>
          </p>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ query, container, authenticationToken }) => {
    const { trust, error } = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const managerEmail = query.email;

    return {
      props: {
        trust: { name: trust?.name },
        managerEmail,
        error,
      },
    };
  })
);

export default archiveAManagerSuccess;
