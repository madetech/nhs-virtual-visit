import React from "react";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyAdminToken from "../../../src/usecases/verifyAdminToken";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Heading from "../../../src/components/Heading";
import ActionLink from "../../../src/components/ActionLink";
import TrustsTable from "../../../src/components/TrustsTable";
import Text from "../../../src/components/Text";
import Error from "next/error";
import { ADMIN } from "../../../src/helpers/userTypes";

const Admin = ({ organizations, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`List of all trusts`}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="full">
          <Heading>List of all trusts</Heading>
          <ActionLink href="trusts/add-a-trust">Add a trust</ActionLink>

          {organizations.length > 0 ? (
            <TrustsTable trusts={organizations} />
          ) : (
            <Text>There are no trusts</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container }) => {
    const {
      organizations,
      error,
    } = await container.getRetrieveOrganizations()();

    return {
      props: { organizations, error },
    };
  })
);

export default Admin;
