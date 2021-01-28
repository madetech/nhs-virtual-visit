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
  mostVisitedWard,
  leastVisitedWard,
  wardVisitTotals,
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
                body={`${mostVisitedWard.wardName} (${mostVisitedWard.totalVisits})`}
              />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <Panel
                title="Least booked visits"
                body={`${leastVisitedWard.wardName} (${leastVisitedWard.totalVisits})`}
              />
            </GridColumn>
          </GridRow>

          <WardsTable
            wards={wards}
            wardVisitTotals={wardVisitTotals}
            hospitalId={hospital.id}
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
  verifyTrustAdminToken(async ({ authenticationToken, container, query }) => {
    const { uuid: facilityUuid } = query;
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
      departments,
      error: departmentsError,
    } = await container.getRetrieveDepartmentsByFacilityId()(facility.id);
    const visitTotals = await container.getRetrieveHospitalVisitTotals()(orgId);

    const totalBookedVisits =
      visitTotals.hospitals.find(({ id }) => id === facility.id)?.totalVisits ||
      0;

    const {
      wards: wardVisitTotals,
      mostVisited: mostVisitedWard,
      leastVisited: leastVisitedWard,
    } = await container.getRetrieveHospitalWardVisitTotals()(facility.id);

    return {
      props: {
        organisation,
        hospital: facility,
        wards: departments,
        error: facilityError || departmentsError || organisationError,
        totalBookedVisits,
        mostVisitedWard,
        leastVisitedWard,
        wardVisitTotals,
      },
    };
  })
);

export default ShowHospital;
