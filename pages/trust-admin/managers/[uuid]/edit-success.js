import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import ActionLink from "../../../../src/components/ActionLink";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";
import PanelSuccess from "../../../../src/components/PanelSuccess";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";

const EditAManagerSuccess = ({ error, manager, trust }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${manager.email} has been updated`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={`${trust.name}`} subHeading="Managers" />
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess name={`${manager.email}`} action={`updated`} />
          <h2>What happens next</h2>

          <ActionLink href="/trust-admin/managers">
            Return to Managers
          </ActionLink>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const managerUuid = query.uuid;
    const { manager, error } = await container.getRetrieveManagerByUuid()(
      managerUuid
    );

    return {
      props: {
        trust: { name: trustResponse.trust?.name },
        manager,
        error,
      },
    };
  })
);

export default EditAManagerSuccess;
