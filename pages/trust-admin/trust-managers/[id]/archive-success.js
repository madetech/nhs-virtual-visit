import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import AnchorLink from "../../../../src/components/AnchorLink";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

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
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div
            className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
            style={{ textAlign: "center" }}
          >
            <h1 className="nhsuk-panel__title">
              {trustManager.email} has been deleted
            </h1>
          </div>
          <p>
            <AnchorLink
              href="/trust-admin/trust-managers"
              as={`/trust-admin/trust-managers`}
            >
              {`Return to Trust Managers`}
            </AnchorLink>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ query, container, authenticationToken }) => {
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const trustManagerId = query.id;
    /*** Trust Manager Array needs to swapped out with info from db once available *****/
    const trustManagers = [
      {
        id: "1",
        email: "abc@nhs.co.uk",
        status: "active",
      },
      {
        id: "2",
        email: "def@nhs.co.uk",
        status: "active",
      },
      {
        id: "3",
        email: "ghi@nhs.co.uk",
        status: "active",
      },
    ];
    const error = "";
    const trustManager = trustManagers?.find(
      (manager) => manager.id === trustManagerId
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
