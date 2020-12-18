import React from "react";
import Error from "next/error";
import Router from "next/router";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import Button from "../../../src/components/Button";
import Heading from "../../../src/components/Heading";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import WardsTable from "../../../src/components/WardsTable";
import NumberTile from "../../../src/components/NumberTile";
import Panel from "../../../src/components/Panel";
import HospitalSummaryList from "../../../src/components/HospitalSummaryList";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const ShowHospital = ({
  trust,
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
      <GridRow>
        <GridColumn width="full">
          <Heading>
            <span className="nhsuk-caption-l">
              {trust.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            {hospital.name}
          </Heading>
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

          <HospitalSummaryList
            name={hospital.name}
            surveyUrl={hospital.surveyUrl}
            supportUrl={hospital.supportUrl}
            withActions={true}
            actionLinkOnClick={() => {
              Router.push(
                "/trust-admin/hospitals/[id]/edit",
                `/trust-admin/hospitals/${hospital.id}/edit`
              );
            }}
          />

          <WardsTable wards={wards} wardVisitTotals={wardVisitTotals} />

          <Button
            className="nhsuk-button"
            onClick={() => {
              Router.push({
                pathname: `/trust-admin/wards/add`,
                query: { hospitalId: hospital.id },
              });
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
    const { id: hospitalId } = query;
    const trustId = authenticationToken.trustId;

    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );

    const {
      hospital,
      error: hospitalError,
    } = await container.getRetrieveHospitalById()(hospitalId, trustId);

    const {
      wards,
      error: wardsError,
    } = await container.getRetrieveWardsByHospitalId()(hospital.id);

    const visitTotals = await container.getRetrieveHospitalVisitTotals()(
      trustId
    );

    const totalBookedVisits =
      visitTotals.hospitals.find(({ id }) => id === hospitalId)?.totalVisits ||
      0;

    const {
      wards: wardVisitTotals,
      mostVisited: mostVisitedWard,
      leastVisited: leastVisitedWard,
    } = await container.getRetrieveHospitalWardVisitTotals()(hospital.id);

    return {
      props: {
        trust: { name: trustResponse.trust?.name },
        hospital,
        wards,
        error: hospitalError || wardsError,
        totalBookedVisits,
        mostVisitedWard,
        leastVisitedWard,
        wardVisitTotals,
      },
    };
  })
);

export default ShowHospital;
