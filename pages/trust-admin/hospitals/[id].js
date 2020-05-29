import React from "react";
import Error from "next/error";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import ActionLink from "../../../src/components/ActionLink";
import Heading from "../../../src/components/Heading";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import WardsTable from "../../../src/components/WardsTable";

const ShowHospital = ({ hospital, wards, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout title={hospital.name} renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>{hospital.name}</Heading>
          <ActionLink href={`/trust-admin/add-a-ward`}>Add a ward</ActionLink>
          <WardsTable wards={wards} />
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

    return { props: { hospital, wards, error: hospitalError || wardsError } };
  })
);

export default ShowHospital;
