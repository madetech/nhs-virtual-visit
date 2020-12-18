import React from "react";
import Error from "next/error";
import Layout from "../../src/components/Layout";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../src/components/Grid";
import TrustAdminHeading from "../../src/components/TrustAdminHeading";
import NumberTile from "../../src/components/NumberTile";
import Text from "../../src/components/Text";
import AnchorLink from "../../src/components/AnchorLink";
import ReviewDate from "../../src/components/ReviewDate";
import { TRUST_ADMIN } from "../../src/helpers/userTypes";

const TrustAdmin = ({
  error,
  wards,
  hospitals,
  leastVisited,
  mostVisited,
  trust,
  averageParticipantsInVisit,
  wardVisitTotalsStartDate,
  reportingStartDate,
  visitsScheduled,
  averageVisitTime,
  averageVisitsPerDay,
}) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`Dashboard for ${trust.name}`}
      showNavigationBarForType={TRUST_ADMIN}
      showNavigationBar={true}
    >
      <TrustAdminHeading trustName={trust.name} subHeading="Dashboard" />
      <GridRow>
        <GridColumn width="full">
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
                number={averageVisitTime}
                label="average visit time"
              />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-third"
            >
              <NumberTile
                number={averageVisitsPerDay}
                label="average visits per day"
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

          <GridRow>
            <GridColumn className="nhsuk-u-one-half" width="one-half">
              <div className="nhsuk-panel nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-0">
                <h3>Most booked visits</h3>
                {mostVisited.length > 0 ? (
                  <ol>
                    {mostVisited.map((hospital) => (
                      <li key={hospital.id}>
                        <AnchorLink
                          href="/trust-admin/hospitals/[id]"
                          as={`/trust-admin/hospitals/${hospital.id}`}
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
            <GridColumn className="nhsuk-u-one-half" width="one-half">
              <div className="nhsuk-panel nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-0">
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

          <ReviewDate
            className="nhsuk-u-margin-bottom-0"
            beforeDateText="Start date for booked visits reporting: "
            date={wardVisitTotalsStartDate}
          />
          <ReviewDate
            className="nhsuk-u-margin-0"
            beforeDateText="Start date for other reporting: "
            date={reportingStartDate}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, authenticationToken }) => {
    const { wards, error: wardError } = await container.getRetrieveWards()(
      authenticationToken.trustId
    );
    const hospitalsResponse = await container.getRetrieveHospitalsByTrustId()(
      authenticationToken.trustId
    );
    const { trust, error: trustError } = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const retrieveHospitalVisitTotals = await container.getRetrieveHospitalVisitTotals()(
      authenticationToken.trustId
    );
    const retrieveWardVisitTotals = await container.getRetrieveWardVisitTotals()(
      authenticationToken.trustId
    );
    const {
      averageParticipantsInVisit,
      error: averageParticipantsInVisitError,
    } = await container.getRetrieveAverageParticipantsInVisit()(
      authenticationToken.trustId
    );
    const {
      startDate: wardVisitTotalsStartDate,
      error: wardVisitTotalsStartDateError,
    } = await container.getRetrieveWardVisitTotalsStartDateByTrustId()(
      authenticationToken.trustId
    );
    const {
      startDate: reportingStartDate,
      error: reportingStartDateError,
    } = await container.getRetrieveReportingStartDateByTrustId()(
      authenticationToken.trustId
    );

    const {
      averageVisitTime,
      error: averageVisitTimeSecondsError,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(
      authenticationToken.trustId
    );

    const {
      averageVisitsPerDay,
      error: averageVisitsPerDayError,
    } = await container.getRetrieveAverageVisitsPerDayByTrustId()(
      authenticationToken.trustId
    );

    const error =
      wardError ||
      trustError ||
      averageParticipantsInVisitError ||
      wardVisitTotalsStartDateError ||
      reportingStartDateError ||
      averageVisitTimeSecondsError ||
      averageVisitsPerDayError;

    return {
      props: {
        wards: wards,
        hospitals: hospitalsResponse.hospitals,
        leastVisited: retrieveHospitalVisitTotals.leastVisited,
        mostVisited: retrieveHospitalVisitTotals.mostVisited,
        trust: { name: trust?.name },
        wardVisitTotalsStartDate,
        reportingStartDate,
        averageParticipantsInVisit,
        visitsScheduled: retrieveWardVisitTotals.total.toLocaleString(),
        averageVisitTime,
        averageVisitsPerDay: averageVisitsPerDay.toFixed(1),
        error,
      },
    };
  })
);

export default TrustAdmin;
