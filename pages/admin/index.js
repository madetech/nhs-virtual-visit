import React from "react";
import Layout from "../../src/components/Layout";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import verifyAdminToken from "../../src/usecases/verifyAdminToken";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import ActionLink from "../../src/components/ActionLink";
import TrustsTable from "../../src/components/TrustsTable";
import Text from "../../src/components/Text";
import Error from "next/error";
import { ADMIN } from "../../src/helpers/userTypes";

const Admin = ({ organisations, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`Site administration`}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="full">
          <Heading>Site administration</Heading>
          <ActionLink href={`/admin/trusts`}>View all trusts</ActionLink>

          {organisations.length > 0 ? (
            <TrustsTable trusts={organisations} />
          ) : (
            <Text>There are no trusts.</Text>
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
    } = await container.getRetrieveActiveOrganisations()();

    return {
      props: { organisations, error },
    };
  })
);

export default Admin;
