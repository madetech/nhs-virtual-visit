import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import ActionLink from "../../../../src/components/ActionLink";
import AnchorLink from "../../../../src/components/AnchorLink";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";
import PanelSuccess from "../../../../src/components/PanelSuccess";
import { GridRow, GridColumn } from "../../../../src/components/Grid";

const EditAHospitalSuccess = ({
  organisation,
  error,
  hospitalName,
  hospitalId,
}) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${hospitalName} has been updated`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={organisation.name} subHeading="Hospitals" />
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess name={`${hospitalName}`} action={`updated`} />
          <h2>What happens next</h2>
          <ActionLink href={`/trust-admin/hospitals/${hospitalId}`}>
            {`View ${hospitalName}`}
          </ActionLink>
          <p>
            <AnchorLink href="/trust-admin/hospitals">
              Return to Hospitals
            </AnchorLink>
          </p>
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

    const getRetrieveHospitalById = container.getRetrieveHospitalById();
    const { hospital, error: hospitalError } = await getRetrieveHospitalById(
      query.id,
      authenticationToken.trustId
    );

    return {
      props: {
        error: organisationError || hospitalError,
        hospitalName: hospital.name,
        hospitalId: hospital.id,
        organisation,
      },
    };
  })
);

export default EditAHospitalSuccess;
