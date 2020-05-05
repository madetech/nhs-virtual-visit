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

const Admin = ({ error, wards }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout title="Admin" renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>Ward Administration</Heading>
          <ActionLink href={`/admin/add-a-ward`}>Add a ward</ActionLink>

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
    async ({ container }) => {
      const { wards, error } = await container.getRetrieveWards()();

      return {
        props: { wards: wards, error: error },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default Admin;
