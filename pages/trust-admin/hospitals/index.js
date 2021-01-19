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
      hospitals,
      error: hospitalsError,
    } = await container.getRetrieveHospitalsByTrustId()(orgId, {
      withWards: true,
    });
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);
    const {
      hospitals: hospitalVisitTotals,
      error: hospitalsVisitTotalError,
    } = await container.getRetrieveHospitalVisitTotals()(orgId);

    const hospitalsWithVisitTotals = hospitals?.map((hospital) => {
      hospital.bookedVisits =
        hospitalVisitTotals.find(({ id }) => id === hospital.id)?.totalVisits ||
        0;
      return hospital;
    });
    return {
      props: {
        hospitals: hospitalsWithVisitTotals,
        organisation,
        error: organisationError || hospitalsError || hospitalsVisitTotalError,
      },
    };
  })
);

export default TrustAdmin;
