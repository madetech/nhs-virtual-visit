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

const ShowHospital = ({
  hospital,
  wards,
  error,
  totalBookedVisits,
  mostVisitedWard,
  leastVisitedWard,
}) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout title={hospital.name} renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>{hospital.name}</Heading>
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
                body={`${mostVisitedWard.wardName} (${mostVisitedWard.total_visits})`}
              />
            </GridColumn>
            <GridColumn
              className="nhsuk-u-padding-bottom-3 nhsuk-u-one-half"
              width="one-half"
            >
              <Panel
                title="Least booked visits"
                body={`${leastVisitedWard.wardName} (${leastVisitedWard.total_visits})`}
              />
            </GridColumn>
          </GridRow>
          <WardsTable wards={wards} />
          <Button
            className="nhsuk-button"
            onClick={() => {
              Router.push({
                pathname: `/trust-admin/add-a-ward`,
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

    const totalBookedVisits = visitTotals[hospital.id] || 0;

    const {
      mostVisited: mostVisitedWard,
      leastVisited: leastVisitedWard,
    } = await container.getRetrieveHospitalWardVisitTotals()(hospital.id);

    return {
      props: {
        hospital,
        wards,
        error: hospitalError || wardsError,
        totalBookedVisits,
        mostVisitedWard,
        leastVisitedWard,
      },
    };
  })
);

export default ShowHospital;
