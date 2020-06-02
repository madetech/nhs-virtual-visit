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

const ShowHospital = ({ hospital, wards, error, totalBookedVisits }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout title={hospital.name} renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>{hospital.name}</Heading>
          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn className="nhsuk-u-padding-bottom-3" width="one-half">
              <NumberTile number={totalBookedVisits} label="booked visits" />
            </GridColumn>
            <GridColumn className="nhsuk-u-padding-bottom-3" width="one-half">
              <NumberTile number={wards.length} label="wards" />
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

    return {
      props: {
        hospital,
        wards,
        error: hospitalError || wardsError,
        totalBookedVisits,
      },
    };
  })
);

export default ShowHospital;
