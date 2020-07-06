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

const Admin = ({ trusts, error }) => {
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
          <ActionLink href={`/admin/add-a-trust`}>Add a trust</ActionLink>

          {trusts.length > 0 ? (
            <TrustsTable trusts={trusts} />
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
    const { trusts, error } = await container.getRetrieveTrusts()();

    return {
      props: { trusts: trusts, error: error },
    };
  })
);

export default Admin;
