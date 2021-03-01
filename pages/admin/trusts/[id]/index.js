import React from "react";
import Layout from "../../../../src/components/Layout";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyAdminToken from "../../../../src/usecases/verifyAdminToken";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Text from "../../../../src/components/Text";
import ManagersTable from "../../../../src/components/ManagersTable";
import AdminHeading from "../../../../src/components/AdminHeading";

import Error from "next/error";
import { ADMIN } from "../../../../src/helpers/userTypes";

const Organisation = ({ organisation, managers, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  return (
    <Layout
      title={`List of all trusts`}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <AdminHeading 
        trustName={organisation.name}
        subHeading="Managers"
      />
      <GridRow>
        <GridColumn width="full">
          { 
            managers?.length > 0 ? (
              <ManagersTable 
                managers={managers} 
              />
            ) : (
              <Text>There are no managers.</Text>
            )
          }
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container, query }) => {
    const { id } = query;

    const retrieveOrganisationById = container.getRetrieveOrganisationById();
    const { 
      organisation,
      error: organisationError 
    } = await retrieveOrganisationById(id);

    const retrieveActiveManagersByOrgId = container.getRetrieveActiveManagersByOrgId();
    const {
      managers,
      error: managersError,
    } = await retrieveActiveManagersByOrgId(id);
    
    return {
      props: { 
        organisation,
        managers, 
        error: organisationError || managersError, 
      },
    };
  })
);

export default Organisation;
