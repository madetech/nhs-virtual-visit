import React from "react";
import Error from "next/error";
import Router from "next/router";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import Button from "../../../../src/components/Button";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import WardsTable from "../../../../src/components/WardsTable";
import NumberTile from "../../../../src/components/NumberTile";
import Panel from "../../../../src/components/Panel";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";

const ShowHospital = ({
  organisation,
  hospital,
  wards,
  error,
  totalBookedVisits,
  totalCompletedVisits,
  mostVisitedWard,
  leastVisitedWard,
}) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={hospital.name}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={organisation.name}
        subHeading={hospital.name}
      />
       <GridRow>
        <GridColumn width="full">
          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <NumberTile number={totalBookedVisits} label="booked visits" />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <NumberTile number={totalCompletedVisits} label="completed visits" />
            </GridColumn>
           
          </GridRow>
          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              {/* this is a dummy tile for now */}
              <NumberTile number={550} label="total visit time in minutes" />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <NumberTile number={wards.length} label="wards" />
            </GridColumn>
          </GridRow>

          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <Panel
                title="Most booked visits"
                body={mostVisitedWard ? 
                  `${mostVisitedWard.name} (${mostVisitedWard.total})`
                : `No visits have been booked.`}
              />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <Panel
                title="Least booked visits"
                body={leastVisitedWard ? 
                  `${leastVisitedWard.name} (${leastVisitedWard.total})`
                : `No visits have been booked.`}
              />
            </GridColumn>
          </GridRow>

          <WardsTable
            wards={wards}
            hospital={hospital}
          />
          <Button
            className="nhsuk-button"
            onClick={() => {
              Router.push(
                `/trust-admin/hospitals/[uuid]/wards/add-ward`,
                `/trust-admin/hospitals/${hospital.uuid}/wards/add-ward`
              );
            }}
          >
            Add a ward
          </Button>
        </GridColumn>
       </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ authenticationToken, container, params }) => {
    const { hospitalUuid: facilityUuid } = params;
    const orgId = authenticationToken.trustId;
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);

    const {
      facility,
      error: facilityError,
    } = await container.getRetrieveFacilityByUuid()(facilityUuid);

    const { 
      total: totalBookedVisits,
      error: totalBookedVisitsError
     } = await container.getRetrieveTotalVisitsByStatusAndFacilityId()(facility.id);

    const { 
      total: totalCompletedVisits,
      error: totalCompletedVisitsError
    } = await container.getRetrieveTotalCompletedVisitsByOrgOrFacilityId()({ facilityId: facility.id });
    
    const {
      departments, 
      mostVisited,
      leastVisited,
      error: departmentsError
    } = await container.getRetrieveTotalBookedVisitsForDepartmentsByFacilityId()(facility.id);
   
    const error = facilityError || departmentsError || organisationError || totalBookedVisitsError || totalCompletedVisitsError;
    
    return {
      props: {
        organisation,
        hospital: facility,
        wards: departments,
        error,
        totalBookedVisits,
        totalCompletedVisits,
        mostVisitedWard: mostVisited,
        leastVisitedWard: leastVisited,
      },
    };
  })
);

export default ShowHospital;
