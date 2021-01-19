import React from "react";
import Error from "next/error";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import AnchorLink from "../../../src/components/AnchorLink";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";
import PanelSuccess from "../../../src/components/PanelSuccess";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import TrustAdminHeading from "../../../src/components/TrustAdminHeading";

const archiveAWardSuccess = ({
  name,
  hospitalName,
  hospitalId,
  error,
  organisation,
}) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`${name} has been deleted`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={`${organisation.name}`}
        subHeading="Trust Managers"
      />
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess
            name={`${name}`}
            action={`deleted`}
            subAction={`for ${hospitalName}`}
          />
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
    const {
      organisation,
      error,
    } = await container.getRetrieveOrganisationById()(
      authenticationToken.trustId
    );
    return {
      props: {
        name: query.name,
        hospitalName: query.hospitalName,
        hospitalId: query.hospitalId,
        organisation,
        error,
      },
    };
  })
);

export default archiveAWardSuccess;
