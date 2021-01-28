import React from "react";
import Error from "next/error";
import Layout from "../../../../../../src/components/Layout";
import propsWithContainer from "../../../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../../../src/usecases/verifyTrustAdminToken";
import AnchorLink from "../../../../../../src/components/AnchorLink";
import { TRUST_ADMIN } from "../../../../../../src/helpers/userTypes";
import PanelSuccess from "../../../../../../src/components/PanelSuccess";
import { GridRow, GridColumn } from "../../../../../../src/components/Grid";
import TrustAdminHeading from "../../../../../../src/components/TrustAdminHeading";

const archiveAWardSuccess = ({ ward, hospital, error, organisation }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`${ward.name} has been deleted`}
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
            name={`${ward.name}`}
            action={`deleted`}
            subAction={`for ${hospital.name}`}
          />
          <p>
            <AnchorLink href={`/trust-admin/hospitals/${hospital.uuid}`}>
              {`Return to ${hospital.name}`}
            </AnchorLink>
          </p>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(
    async ({ container, query, params, authenticationToken }) => {
      const hospitalName = query?.hospitalName;
      const wardUuid = params?.wardUuid;
      const hospitalUuid = params?.hospitalUuid;

      const {
        organisation,
        error: organisationError,
      } = await container.getRetrieveOrganisationById()(
        authenticationToken.trustId
      );

      const {
        department,
        error: departmentError,
      } = await container.getRetrieveDepartmentByUuid()(wardUuid);

      const queryOrParamsError =
        !hospitalName || !hospitalUuid || !wardUuid ? true : null;

      return {
        props: {
          ward: department,
          hospital: { name: hospitalName, uuid: hospitalUuid },
          organisation,
          error: organisationError || departmentError || queryOrParamsError,
        },
      };
    }
  )
);

export default archiveAWardSuccess;
