import React from "react";
import Error from "next/error";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Text from "../../../src/components/Text";
import TrustAdminHeading from "../../../src/components/TrustAdminHeading";
import ManagersTable from "../../../src/components/ManagersTable";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const Manager = ({ managers, organisation, error, currentManagerId }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`Trust Managers for ${organisation.name}`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={`${organisation.name}`}
        subHeading="Managers"
      />
      <GridRow>
        <GridColumn width="full">
          {managers.length > 0 ? (
            <ManagersTable 
              managers={managers}
              currentManagerId={currentManagerId}
              url={"/trust-admin/managers"} 
            />
          ) : (
            <Text>There are no managers.</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, authenticationToken }) => {
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(
      authenticationToken.trustId
    );

    const {
      managers,
      error: managersError,
    } = await container.getRetrieveActiveManagersByOrgId()(
      authenticationToken.trustId
    );

    return {
      props: {
        managers,
        currentManagerId: authenticationToken.userId,
        organisation,
        error: organisationError || managersError,
      },
    };
  })
);

export default Manager;
