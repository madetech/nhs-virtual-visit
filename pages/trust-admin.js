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
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );

    const retrieveWardVisitTotals = container.getRetrieveWardVisitTotals();
    const { total } = await retrieveWardVisitTotals();

    return {
      props: {
        wards: wardsResponse.wards,
        trust: { name: trustResponse.trust?.name },
        wardError: wardsResponse.error,
        trustError: trustResponse.error,
        visitsScheduled: total,
      },
    };
  })
);

export default TrustAdmin;
