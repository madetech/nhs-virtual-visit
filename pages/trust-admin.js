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
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

const TrustAdmin = ({
  error,
  wards,
  hospitals,
  leastVisited,
  mostVisited,
  trust,
  averageParticipantsInVisit,
  wardVisitTotalsStartDate,
  visitsScheduled,
  averageVisitTime,
}) => {
  if (error) {
    return <Error err={error} />;
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
          {wardVisitTotalsStartDate && (
            <ReviewDate>
              Reporting for booked visits start date: {wardVisitTotalsStartDate}
            </ReviewDate>
          )}
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
    const retrieveWardVisitTotalsStartDateResponse = await container.getRetrieveWardVisitTotalsStartDateByTrustId()(
      authenticationToken.trustId
    );

    const wardVisitTotalsStartDate = retrieveWardVisitTotalsStartDateResponse.startDate
      ? formatDate(retrieveWardVisitTotalsStartDateResponse.startDate)
      : null;

    const {
      averageVisitTimeSeconds,
      error: averageVisitTimeSecondsError,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(
      authenticationToken.trustId
    );

    const averageVisitTime = moment
      .duration(averageVisitTimeSeconds, "seconds")
      .format("h [hours], m [minutes]");

    const error =
      wardError ||
      trustError ||
      averageParticipantsInVisitError ||
      retrieveWardVisitTotalsStartDateResponse.error ||
      averageVisitTimeSecondsError;

    return {
      props: {
        wards: wards,
        hospitals: hospitalsResponse.hospitals,
        leastVisited: retrieveHospitalVisitTotals.leastVisited,
        mostVisited: retrieveHospitalVisitTotals.mostVisited,
        trust: { name: trust?.name },
        wardVisitTotalsStartDate,
        averageParticipantsInVisit,
        visitsScheduled: retrieveWardVisitTotals.total,
        averageVisitTime,
        error,
      },
    };
  })
);

export default TrustAdmin;
