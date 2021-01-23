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

const AddAHospitalSuccess = ({ organisation, error, hospital }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${hospital.name} has been added`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={organisation.name} subHeading="Hospitals" />

      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess name={`${hospital.name}`} action={`added`} />
          <h2>What happens next</h2>

          <ActionLink href={`/trust-admin/hospitals/add-hospital`}>
            Add another hospital
          </ActionLink>
          <p>
            <AnchorLink href={`/trust-admin/hospitals/${hospital.uuid}`}>
              {`Go to ${hospital.name}`}
            </AnchorLink>
          </p>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, params, authenticationToken }) => {
    const { hospitalUuid: facilityUuid } = params;
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(
      authenticationToken.trustId
    );

    const {
      facility: { name, uuid },
      error: facilityError,
    } = await container.getRetrieveFacilityByUuid()(facilityUuid);

    return {
      props: {
        error: organisationError || facilityError,
        hospital: { name, uuid },
        organisation,
      },
    };
  })
);

export default AddAHospitalSuccess;
