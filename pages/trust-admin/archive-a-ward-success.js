import React from "react";
import Layout from "../../src/components/Layout";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../src/usecases/verifyTrustAdminToken";
import AnchorLink from "../../src/components/AnchorLink";

const archiveAWardSuccess = ({ name, hospitalName }) => {
  return (
    <Layout title={`${name} has been deleted`} renderLogout={true}>
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div
            className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
            style={{ textAlign: "center" }}
          >
            <h1 className="nhsuk-panel__title">{name} has been deleted</h1>

            <div className="nhsuk-panel__body">for {hospitalName}</div>
          </div>
          <p>
            <AnchorLink href="/trust-admin">
              Return to ward trustAdministration
            </AnchorLink>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ query }) => {
    console.log(query);
    return {
      props: { name: query.name, hospitalName: query.hospitalName },
    };
  })
);

export default archiveAWardSuccess;
