import React from "react";
import Layout from "../src/components/Layout";
import propsWithContainer from "../src/middleware/propsWithContainer";
import verifyAdminToken from "../src/usecases/verifyAdminToken";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";

const Admin = () => {
  return (
    <Layout title={`Site administration`} renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>Site administration</Heading>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async () => {
    return {
      props: {},
    };
  })
);

export default Admin;
