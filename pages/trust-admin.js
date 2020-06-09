import React from "react";
import Error from "next/error";
import Layout from "../src/components/Layout";
import propsWithContainer from "../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import NumberTile from "../src/components/NumberTile";
import Text from "../src/components/Text";
import { TRUST_ADMIN } from "../src/helpers/userTypes";

const TrustAdmin = ({
  wardError,
  trustError,
  wards,
  hospitals,
  trust,
  visitsScheduled,
  leastUsage,
  mostUsage,
}) => {
  if (wardError || trustError) {
    return <Error />;
  }

  return (
    <Layout
      title={`Dashboard for ${trust.name}`}
      renderLogout={true}
      showNavigationBarForType={TRUST_ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="full">
          <Heading>
            <span className="nhsuk-caption-l">
              {trust.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            Dashboard
          </Heading>
          <h2>Trust</h2>
          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-third"
              width="one-third"
            >
              <NumberTile number={visitsScheduled} label="booked visits" />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-third"
              width="one-third"
            >
              <NumberTile number={hospitals.length} label="hospitals" />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-third"
              width="one-third"
            >
              <NumberTile number={wards.length} label="wards" />
            </GridColumn>
          </GridRow>
          <h2>Usage</h2>
          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <div className="nhsuk-panel nhsuk-u-margin-top-1">
                <h3>Most booked visits</h3>
                {leastUsage.length > 0 ? (
                  <ol>
                    {leastUsage.map((hospital) => (
                      <li key={hospital.id}>
                        {hospital.name} ({hospital.totalVisits})
                      </li>
                    ))}
                  </ol>
                ) : (
                  <Text>No visits have been booked.</Text>
                )}
              </div>
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <div className="nhsuk-panel nhsuk-u-margin-top-1">
                <h3>Least booked visits</h3>
                {mostUsage.length > 0 ? (
                  <ol>
                    {mostUsage.map((hospital) => (
                      <li key={hospital.id}>
                        {hospital.name} ({hospital.totalVisits})
                      </li>
                    ))}
                  </ol>
                ) : (
                  <Text>No visits have been booked.</Text>
                )}
              </div>
            </GridColumn>
          </GridRow>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, authenticationToken }) => {
    const wardsResponse = await container.getRetrieveWards()(
      authenticationToken.trustId
    );
    const hospitalsResponse = await container.getRetrieveHospitalsByTrustId()(
      authenticationToken.trustId
    );
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const retrieveHospitalVisitTotals = await container.getRetrieveHospitalVisitTotals()(
      authenticationToken.trustId
    );
    const retrieveWardVisitTotals = await container.getRetrieveWardVisitTotals()(
      authenticationToken.trustId
    );

    return {
      props: {
        wards: wardsResponse.wards,
        hospitals: hospitalsResponse.hospitals,
        trust: { name: trustResponse.trust?.name },
        wardError: wardsResponse.error,
        trustError: trustResponse.error,
        visitsScheduled: retrieveWardVisitTotals.total,
        leastUsage: retrieveHospitalVisitTotals.slice(0, 3),
        mostUsage: retrieveHospitalVisitTotals.slice(-3).reverse(),
      },
    };
  })
);

export default TrustAdmin;
