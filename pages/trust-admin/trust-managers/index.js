import React from "react";
import Error from "next/error";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Text from "../../../src/components/Text";
import TrustAdminHeading from "../../../src/components/TrustAdminHeading";
import Table from "../../../src/components/TrustManagersTable";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const TrustManager = ({ trustManagers, trust, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`Trust Managers for ${trust.name}`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={`${trust.name}`}
        subHeading="Trust Managers"
      />
      <GridRow>
        <GridColumn width="full">
          {trustManagers.length > 0 ? (
            <Table type="trust-manager" trustManagers={trustManagers} />
          ) : (
            <Text>There are no trust managers.</Text>
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
    return {
      props: {
        trustManagers: [
          {
            id: 1,
            email: "abc@nhs.co.uk",
            status: "active",
          },
          {
            id: 2,
            email: "def@nhs.co.uk",
            status: "active",
          },
          {
            id: 3,
            email: "ghi@nhs.co.uk",
            status: "active",
          },
        ],
        trust: { name: trustResponse.trust?.name },
        error: trustResponse.error,
      },
    };
  })
);

export default TrustManager;
