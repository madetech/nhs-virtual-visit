import React from "react";
import Error from "next/error";
import Layout from "../src/components/Layout";
import propsWithContainer from "../src/middleware/propsWithContainer";
import TokenProvider from "../src/providers/TokenProvider";
import verifyAdminToken from "../src/usecases/verifyAdminToken";
import WardsTable from "../src/components/WardsTable";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import ActionLink from "../src/components/ActionLink";
import Text from "../src/components/Text";

const Admin = ({ wardError, trustError, wards, trust }) => {
  if (wardError || trustError) {
    return <Error />;
  }

  return (
    <Layout
      title={`Ward admininistration for ${trust.name}`}
      renderLogout={true}
    >
      <GridRow>
        <GridColumn width="full">
          <Heading>
            <span className="nhsuk-caption-l">
              {trust.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            Ward admininistration
          </Heading>
          <ActionLink href={`/admin/add-a-ward`}>Add a ward</ActionLink>
          <ActionLink href={`/admin/add-a-hospital`}>Add a hospital</ActionLink>

          {wards.length > 0 ? (
            <WardsTable wards={wards} />
          ) : (
            <Text>There are no upcoming virtual visits.</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(
    async ({ container, authenticationToken }) => {
      const wardsResponse = await container.getRetrieveWards()(
        authenticationToken.trustId
      );
      const trustResponse = await container.getRetrieveTrustById()(
        authenticationToken.trustId
      );

      // const trustName = trustResponse.trust ? trustResponse.trust.name : null;

      return {
        props: {
          wards: wardsResponse.wards,
          trust: { name: trustResponse.trust?.name },
          wardError: wardsResponse.error,
          trustError: trustResponse.error,
        },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default Admin;
