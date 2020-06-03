import React from "react";
import Error from "next/error";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import HospitalsTable from "../../../src/components/HospitalsTable";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Heading from "../../../src/components/Heading";
import ActionLink from "../../../src/components/ActionLink";
import Text from "../../../src/components/Text";

const TrustAdmin = ({ hospitals, hospitalError, trust, trustError }) => {
  if (hospitalError || trustError) {
    return <Error err={hospitalError || trustError} />;
  }

  return (
    <Layout title={`Hospitals for ${trust.name}`} renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>
            <span className="nhsuk-caption-l">
              {trust.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            Hospitals
          </Heading>
          <ActionLink href={`/trust-admin/add-a-hospital`}>
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
      authenticationToken.trustId
    );
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const hospitalVisitTotalsResponse = await container.getRetrieveHospitalVisitTotals()(
      authenticationToken.trustId
    );

    const hospitalsWithVisitTotals = hospitalsResponse.hospitals?.map(
      (hospital) => {
        hospital.bookedVisits = hospitalVisitTotalsResponse[hospital.id] || 0;
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
