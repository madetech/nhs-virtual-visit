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

const TrustAdmin = ({ hospitals, hospitalError, trust, trustError }) => {
  if (hospitalError || trustError) {
    return <Error err={hospitalError || trustError} />;
  }

  return (
    <Layout
      title={`Hospitals for ${trust.name}`}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading="Hospitals" />
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
    const hospitalsResponse = await container.getRetrieveHospitalsByTrustId()(
      authenticationToken.trustId,
      { withWards: true }
    );
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const hospitalVisitTotalsResponse = await container.getRetrieveHospitalVisitTotals()(
      authenticationToken.trustId
    );

    const hospitalsWithVisitTotals = hospitalsResponse.hospitals?.map(
      (hospital) => {
        hospital.bookedVisits =
          hospitalVisitTotalsResponse.hospitals.find(
            ({ id }) => id === hospital.id
          )?.totalVisits || 0;
        return hospital;
      }
    );

    return {
      props: {
        hospitals: hospitalsWithVisitTotals,
        hospitalError: hospitalsResponse.error,
        trust: { name: trustResponse.trust?.name },
        trustError: trustResponse.error,
      },
    };
  })
);

export default TrustAdmin;
