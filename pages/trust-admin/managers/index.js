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

const Manager = ({ managers, trust, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`Trust Managers for ${trust.name}`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={`${trust.name}`} subHeading="Managers" />
      <GridRow>
        <GridColumn width="full">
          {managers.length > 0 ? (
            <ManagersTable managers={managers} />
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
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );

    const { managers, error } = await container.getRetrieveManagerByOrgId()(
      authenticationToken.trustId
    );

    return {
      props: {
        managers,
        trust: { name: trustResponse.trust?.name },
        error: trustResponse.error || error,
      },
    };
  })
);

export default Manager;
