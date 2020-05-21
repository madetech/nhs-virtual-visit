import React from "react";
import Error from "next/error";
import Layout from "../../src/components/Layout";
import AnchorLink from "../../src/components/AnchorLink";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../src/usecases/verifyTrustAdminToken";
import ActionLink from "../../src/components/ActionLink";

const AddAHospitalSuccess = ({ error, name }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout title={`${name} has been added`} renderLogout={true}>
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div
            className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
            style={{ textAlign: "center" }}
          >
            <h1 className="nhsuk-panel__title">{name} has been added</h1>
          </div>
          <h2>What happens next</h2>

          <ActionLink href={`/trust-admin/add-a-hospital`}>
            Add another hospital
          </ActionLink>

          <p>
            <AnchorLink href="/trust-admin">
              Return to ward administration
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
      query.hospitalId,
      authenticationToken.trustId
    );

    if (error) {
      return { props: { error: error } };
    } else {
      return {
        props: {
          error: error,
          name: hospital.name,
        },
      };
    }
  })
);

export default AddAHospitalSuccess;
