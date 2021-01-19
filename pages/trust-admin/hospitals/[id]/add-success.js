import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import AnchorLink from "../../../../src/components/AnchorLink";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import ActionLink from "../../../../src/components/ActionLink";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import PanelSuccess from "../../../../src/components/PanelSuccess";

const AddAHospitalSuccess = ({ organisation, error, name, id }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${name} has been added`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={organisation.name} subHeading="Hospitals" />

      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess name={`${name}`} action={`added`} />
          <h2>What happens next</h2>

          <ActionLink href={`/trust-admin/hospitals/add`}>
            Add another hospital
          </ActionLink>
          <p>
            <AnchorLink href={`/trust-admin/hospitals/${id}`}>
              {`Go to ${name}`}
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
        name: hospital.name,
        id: hospital.id,
        organisation,
      },
    };
  })
);

export default AddAHospitalSuccess;
