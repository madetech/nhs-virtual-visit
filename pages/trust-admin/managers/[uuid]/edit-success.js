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

const EditAManagerSuccess = ({ error, organisation, manager }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${manager.email} has been updated`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={`${organisation.name}`}
        subHeading="Managers"
      />
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
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(
      authenticationToken.trustId
    );
    const managerUuid = query.uuid;
    const {
      manager,
      error: managerError,
    } = await container.getRetrieveManagerByUuid()(managerUuid);

    return {
      props: {
        organisation,
        manager,
        error: managerError || organisationError,
      },
    };
  })
);

export default EditAManagerSuccess;
