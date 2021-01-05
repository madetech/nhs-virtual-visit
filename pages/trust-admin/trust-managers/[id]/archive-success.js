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

const archiveATrustManagerSuccess = ({ trust, trustManager, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`${trustManager.email} has been deleted`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading="Trust Managers" />
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess name={`${trustManager.email}`} action="deleted" />
          <p>
            <AnchorLink
              href="/trust-admin/trust-managers"
              as={`/trust-admin/trust-managers`}
            >
              Return to Trust Managers
            </AnchorLink>
          </p>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ query, container, authenticationToken }) => {
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const trustManagerId = query.uuid;
    /*** Trust Manager Array needs to swapped out with info from db once available *****/
    const trustManagers = [
      {
        uuid: "8626856E-2AA4-4F19-89FD-9C0E6FD8EB0B",
        email: "nhs-org2@nhs.co.uk",
        status: "active",
      },
    ];
    const error = "";
    const trustManager = trustManagers?.find(
      (manager) => manager.uuid === trustManagerId
    );
    if (error) {
      return {
        props: {
          error,
        },
      };
    }
    return {
      props: {
        trust: { name: trustResponse.trust?.name },
        trustManager,
      },
    };
  })
);

export default archiveATrustManagerSuccess;
