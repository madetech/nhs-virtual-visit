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

const AddAWardSuccess = ({ trust, error, name, hospitalName, hospitalId }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${name} has been added`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading={hospitalName} />
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
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );

    const getRetrieveWardById = container.getRetrieveWardById();
    const { ward, error } = await getRetrieveWardById(
      query.id,
      authenticationToken.trustId
    );
    return {
      props: {
        error: error,
        name: ward.name,
        hospitalName: ward.hospitalName,
        hospitalId: ward.hospitalId,
        trust: { name: trustResponse.trust?.name },
      },
    };
  })
);

export default AddAWardSuccess;
