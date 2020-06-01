import React from "react";
import Error from "next/error";
import Layout from "../src/components/Layout";
import propsWithContainer from "../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../src/usecases/verifyTrustAdminToken";
import WardsTable from "../src/components/WardsTable";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import ActionLink from "../src/components/ActionLink";
import Text from "../src/components/Text";
import NumberTile from "../src/components/NumberTile";

const TrustAdmin = ({
  wardError,
  trustError,
  wards,
  hospitals,
  trust,
  visitsScheduled,
}) => {
  if (wardError || trustError) {
    return <Error />;
  }

  return (
    <Layout title={`Ward administration for ${trust.name}`} renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>
            <span className="nhsuk-caption-l">
              {trust.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            Ward administration
          </Heading>
          <GridRow className="nhsuk-u-padding-bottom-3">
            <GridColumn className="nhsuk-u-padding-bottom-3" width="one-third">
              <NumberTile number={visitsScheduled} label="booked visits" />
            </GridColumn>
            <GridColumn className="nhsuk-u-padding-bottom-3" width="one-third">
              <NumberTile number={hospitals.length} label="hospitals" />
            </GridColumn>
            <GridColumn className="nhsuk-u-padding-bottom-3" width="one-third">
              <NumberTile number={wards.length} label="wards" />
            </GridColumn>
          </GridRow>
          <ActionLink href={`/trust-admin/add-a-ward`}>Add a ward</ActionLink>
          <ActionLink href={`/trust-admin/add-a-hospital`}>
            Add a hospital
          </ActionLink>
          {wards.length > 0 ? (
            <WardsTable wards={wards} />
          ) : (
            <Text>There are no wards.</Text>
          )}
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
    const retrieveWardVisitTotals = await container.getRetrieveWardVisitTotals()(
      authenticationToken.trustId
    );

    return {
      props: {
        wards: wardsResponse.wards,
        hospitals: hospitalsResponse.hospitals,
        trust: { name: trustResponse.trust?.name },
        wardError: wardsResponse.error,
        trustError: trustResponse.error,
        visitsScheduled: retrieveWardVisitTotals.total,
      },
    };
  })
);

export default TrustAdmin;
