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
  leastVisitedList,
  mostVisitedList,
  organisation,
  totalCompletedVisits,
  wardVisitTotalsStartDate,
  reportingStartDate,
  totalBookedVisits,
  averageVisitTime,
  averageVisitsPerDay,
}) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`Dashboard for ${organisation.name}`}
      showNavigationBarForType={TRUST_ADMIN}
      showNavigationBar={true}
    >
      <TrustAdminHeading trustName={organisation.name} subHeading="Dashboard" />
      <GridRow>
        <GridColumn width="full">
          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-third"
            >
              <NumberTile number={totalBookedVisits} label="booked visits" />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-third"
            >
              <NumberTile
                number={totalCompletedVisits}
                label="completed visits"
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
                {mostVisitedList.length > 0 ? (
                  <ol>
                    {mostVisitedList.map((hospital) => (
                      <li key={hospital.id}>
                        <AnchorLink
                          href={`/trust-admin/hospitals/${hospital.uuid}`}
                        >
                          {hospital.name}
                          <span className="nhsuk-u-visually-hidden">
                            {" "}
                            {hospital.name}
                          </span>
                        </AnchorLink>{" "}
                        ({hospital.total})
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
                {leastVisitedList.length > 0 ? (
                  <ol>
                    {leastVisitedList.map((hospital) => (
                      <li key={hospital.id}>
                        <AnchorLink
                          href={`/trust-admin/hospitals/${hospital.uuid}`}
                        >
                          {hospital.name}
                          <span className="nhsuk-u-visually-hidden">
                            {" "}
                            {hospital.name}
                          </span>
                        </AnchorLink>{" "}
                        ({hospital.total})
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
    const {
      departments,
      error: wardError,
    } = await container.getRetrieveDepartments()(authenticationToken.trustId);
    const {
      facilities,
      error: facilitiesError,
    } = await container.getRetrieveFacilitiesByOrgId()(
      authenticationToken.trustId
    );

    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(
      authenticationToken.trustId
    );

    const {
      mostVisitedList,
      leastVisitedList,
      error: mostAndLeastVisitedListError
     } = await container.getRetrieveTotalBookedVisitsForFacilitiesByOrgId()(
      authenticationToken.trustId
    );

    const { 
      total: totalBookedVisits, 
      error: totalBookedVisitsError } = await container.getRetrieveTotalVisitsByStatusAndOrgId()(
      authenticationToken.trustId,
    );
    
    const { 
      total: totalCompletedVisits, 
      error: totalCompletedVisitsError } = await container.getRetrieveTotalCompletedVisitsByOrgOrFacilityId()(
      { orgId: authenticationToken.trustId },
    );

    const {
      startDate: wardVisitTotalsStartDate,
      error: wardVisitTotalsStartDateError,
    } = await container.getRetrieveDepartmentVisitTotalsStartDateByOrganisationId()(
      authenticationToken.trustId
    );

    const {
      startDate: reportingStartDate,
      error: reportingStartDateError,
    } = await container.getRetrieveReportingStartDateByOrganisationId()(
      authenticationToken.trustId
    );

    const {
      averageVisitTime,
      error: averageVisitTimeSecondsError,
    } = await container.getRetrieveAverageVisitTimeByOrganisationId()(
      authenticationToken.trustId
    );

    const {
      averageVisitsPerDay,
      error: averageVisitsPerDayError,
    } = await container.getRetrieveAverageVisitsPerDayByOrganisationId()(
      authenticationToken.trustId
    );
    
    const error =
      wardError ||
      facilitiesError ||
      totalBookedVisitsError ||
      totalCompletedVisitsError ||
      wardVisitTotalsStartDateError ||
      reportingStartDateError ||
      averageVisitTimeSecondsError ||
      averageVisitsPerDayError ||
      mostAndLeastVisitedListError ||
      organisationError;

    return {
      props: {
        wards: departments,
        hospitals: facilities,
        leastVisitedList,
        mostVisitedList,
        organisation,
        wardVisitTotalsStartDate,
        reportingStartDate,
        totalCompletedVisits,
        totalBookedVisits,
        averageVisitTime,
        averageVisitsPerDay: averageVisitsPerDay.toFixed(1),
        error,
      },
    };
  })
);

export default TrustAdmin;
