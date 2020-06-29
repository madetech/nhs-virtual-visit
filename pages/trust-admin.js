import React from "react";
import Error from "next/error";
import Layout from "../src/components/Layout";
import propsWithContainer from "../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import NumberTile from "../src/components/NumberTile";
import Text from "../src/components/Text";
import AnchorLink from "../src/components/AnchorLink";
import ReviewDate from "../src/components/ReviewDate";
import { TRUST_ADMIN } from "../src/helpers/userTypes";
import formatDate from "../src/helpers/formatDate";

const TrustAdmin = ({
  wardError,
  trustError,
  wards,
  hospitals,
  leastVisited,
  mostVisited,
  trust,
  averageParticipantsInVisit,
  averageParticipantsInVisitError,
  wardVisitTotalsStartDate,
  wardVisitTotalsStartDateError,
  visitsScheduled,
}) => {
  if (wardError || trustError || averageParticipantsInVisitError) {
    return (
      <Error
        err={
          wardError ||
          trustError ||
          averageParticipantsInVisitError ||
          wardVisitTotalsStartDateError
        }
      />
    );
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

          {wardVisitTotalsStartDate && (
            <ReviewDate>
              Reporting for booked visits start date: {wardVisitTotalsStartDate}
            </ReviewDate>
          )}

          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-third"
            >
              <NumberTile number={visitsScheduled} label="booked visits" />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-third"
            >
              <NumberTile
                number={averageParticipantsInVisit}
                label="average participants in a visit"
              />
            </GridColumn>
          </GridRow>

          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-third"
            >
              <NumberTile
                number={hospitals.length}
                label="hospitals"
                small={true}
              />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-third"
            >
              <NumberTile number={wards.length} label="wards" small={true} />
            </GridColumn>
          </GridRow>

          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <div className="nhsuk-panel nhsuk-u-margin-top-1">
                <h3>Most booked visits</h3>
                {mostVisited.length > 0 ? (
                  <ol>
                    {mostVisited.map((hospital) => (
                      <li key={hospital.id}>
                        <AnchorLink
                          href={`/trust-admin/hospitals/${hospital.id}`}
                        >
                          {hospital.name}
                          <span className="nhsuk-u-visually-hidden">
                            {" "}
                            {hospital.name}
                          </span>
                        </AnchorLink>{" "}
                        ({hospital.totalVisits})
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
                {leastVisited.length > 0 ? (
                  <ol>
                    {leastVisited.map((hospital) => (
                      <li key={hospital.id}>
                        <AnchorLink
                          href={`/trust-admin/hospitals/${hospital.id}`}
                        >
                          {hospital.name}
                          <span className="nhsuk-u-visually-hidden">
                            {" "}
                            {hospital.name}
                          </span>
                        </AnchorLink>{" "}
                        ({hospital.totalVisits})
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
    const averageParticipantsInVisitResponse = await container.getRetrieveAverageParticipantsInVisit()(
      authenticationToken.trustId
    );
    const retrieveWardVisitTotalsStartDateResponse = await container.getRetrieveWardVisitTotalsStartDateByTrustId()(
      authenticationToken.trustId
    );

    const wardVisitTotalsStartDate = retrieveWardVisitTotalsStartDateResponse.startDate
      ? formatDate(retrieveWardVisitTotalsStartDateResponse.startDate)
      : null;

    return {
      props: {
        wards: wardsResponse.wards,
        hospitals: hospitalsResponse.hospitals,
        leastVisited: retrieveHospitalVisitTotals.leastVisited,
        mostVisited: retrieveHospitalVisitTotals.mostVisited,
        trust: { name: trustResponse.trust?.name },
        averageParticipantsInVisit:
          averageParticipantsInVisitResponse.averageParticipantsInVisit,
        wardVisitTotalsStartDate: wardVisitTotalsStartDate,
        wardError: wardsResponse.error,
        trustError: trustResponse.error,
        averageParticipantsInVisitError:
          averageParticipantsInVisitResponse.error,
        wardVisitTotalsStartDateError:
          retrieveWardVisitTotalsStartDateResponse.error,
        visitsScheduled: retrieveWardVisitTotals.total,
      },
    };
  })
);

export default TrustAdmin;
