import React from "react";
import Error from "next/error";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import HospitalsTable from "../../../src/components/HospitalsTable";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import TrustAdminHeading from "../../../src/components/TrustAdminHeading";
import ActionLink from "../../../src/components/ActionLink";
import Text from "../../../src/components/Text";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const TrustAdmin = ({ hospitals, error, organisation }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`Hospitals for ${organisation.name}`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={organisation.name} subHeading="Hospitals" />
      <GridRow>
        <GridColumn width="full">
          <ActionLink href={`/trust-admin/hospitals/add`}>
            Add a hospital
          </ActionLink>
          {hospitals.length > 0 ? (
            <HospitalsTable hospitals={hospitals} />
          ) : (
            <Text>There are no hospitals.</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, authenticationToken }) => {
    const orgId = authenticationToken.trustId;
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);
    const {
      facilities,
      error: facilitiesError,
    } = await container.getRetrieveFacilitiesByOrgId()(orgId, {
      withWards: true,
    });

    const {
      hospitals: hospitalVisitTotals,
      error: hospitalsVisitTotalError,
    } = await container.getRetrieveHospitalVisitTotals()(orgId);

    const facilitiesWithVisitTotals = facilities?.map((facility) => {
      facility.bookedVisits =
        hospitalVisitTotals.find(({ id }) => id === facility.id)?.totalVisits ||
        0;
      return facility;
    });
    return {
      props: {
        hospitals: facilitiesWithVisitTotals || null,
        organisation,
        error: organisationError || facilitiesError || hospitalsVisitTotalError,
      },
    };
  })
);

export default TrustAdmin;
