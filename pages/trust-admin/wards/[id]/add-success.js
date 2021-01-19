import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import AnchorLink from "../../../../src/components/AnchorLink";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import ActionLink from "../../../../src/components/ActionLink";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import PanelSuccess from "../../../../src/components/PanelSuccess";

const AddAWardSuccess = ({
  organisation,
  error,
  name,
  hospitalName,
  hospitalId,
}) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${name} has been added`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={organisation.name}
        subHeading={hospitalName}
      />
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess
            name={`${name}`}
            action={`added`}
            subAction={`for ${hospitalName}`}
          />
          <h2>What happens next</h2>
          <ActionLink href={`/trust-admin/wards/add?hospitalId=${hospitalId}`}>
            Add another ward for {hospitalName}
          </ActionLink>
          <p>
            <AnchorLink
              href="/trust-admin/hospitals/[id]"
              as={`/trust-admin/hospitals/${hospitalId}`}
            >
              {`Return to ${hospitalName}`}
            </AnchorLink>
          </p>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const orgId = authenticationToken.trustId;
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);

    const getRetrieveWardById = container.getRetrieveWardById();
    const { ward, error: wardError } = await getRetrieveWardById(
      query.id,
      orgId
    );
    return {
      props: {
        error: organisationError || wardError,
        name: ward.name,
        hospitalName: ward.hospitalName,
        hospitalId: ward.hospitalId,
        organisation,
      },
    };
  })
);

export default AddAWardSuccess;
