import React from "react";
import Layout from "../../../src/components/Layout";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import verifyAdminToken from "../../../src/usecases/verifyAdminToken";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Heading from "../../../src/components/Heading";
import ActionLink from "../../../src/components/ActionLink";
import TrustsListTable from "../../../src/components/TrustsListTable";
import Text from "../../../src/components/Text";
import Error from "next/error";
import { ADMIN } from "../../../src/helpers/userTypes";

const Admin = ({ organisations, error }) => {
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
          {organisations.length > 0 ? (
            <TrustsListTable trusts={organisations} />
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
      organisations,
      error,
    } = await container.getRetrieveOrganisations()();

    return {
      props: { organisations, error },
    };
  })
);

export default Admin;
