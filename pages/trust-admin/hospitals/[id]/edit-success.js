import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import ActionLink from "../../../../src/components/ActionLink";
import AnchorLink from "../../../../src/components/AnchorLink";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";

const EditAHospitalSuccess = ({ error, hospitalName, hospitalId }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${hospitalName} has been updated`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div
            className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
            style={{ textAlign: "center" }}
          >
            <h1 className="nhsuk-panel__title">
              {hospitalName} has been updated
            </h1>
          </div>
          <h2>What happens next</h2>
          <ActionLink href={`/trust-admin/hospitals/${hospitalId}`}>
            {`View ${hospitalName}`}
          </ActionLink>
          <p>
            <AnchorLink href="/trust-admin/hospitals/">
              Return to Hospitals
            </AnchorLink>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const getRetrieveHospitalById = container.getRetrieveHospitalById();
    const { hospital, error } = await getRetrieveHospitalById(
      query.id,
      authenticationToken.trustId
    );

    return {
      props: {
        error: error,
        hospitalName: hospital.name,
        hospitalId: hospital.id,
      },
    };
  })
);

export default EditAHospitalSuccess;
