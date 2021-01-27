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
import { Pagination } from "../../../src/components/Pagination";

const Admin = ({ organisations, page, totalPages, error }) => {
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
            <div>
              <TrustsListTable trusts={organisations} />
              <Pagination
                previousHref={`/admin/trusts?page=${page - 1}`}
                previousName={page === 0 ? null : `Page ${page}`}
                nextHref={`/admin/trusts?page=${page + 1}`}
                nextName={page > totalPages - 1 ? null : `Page ${page + 2}`}
              />
            </div>
          ) : (
            <Text>There are no trusts</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container, query }) => {
    const page = query.page ? parseInt(query.page) : 0;
    const limit = query.limit ? parseInt(query.limit) : 10;

    const {
      organisations,
      total,
      error,
    } = await container.getRetrieveOrganisations()({
      page,
      limit,
    });

    const totalPages = total / limit;

    return {
      props: { organisations, page, totalPages, error },
    };
  })
);

export default Admin;
