import React, { useState } from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Layout from "../../src/components/Layout";
import verifyTrustAdminToken from "../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import AddWardForm from "../../src/components/AddWardForm";
import Error from "next/error";

const AddAWard = ({ hospitals, error }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);

  return (
    <Layout
      title="Add a ward"
      hasErrors={errors.length != 0}
      renderLogout={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <AddWardForm
            errors={errors}
            setErrors={setErrors}
            hospitals={hospitals}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, authenticationToken }) => {
    const retrieveHospitalsByTrustId = container.getRetrieveHospitalsByTrustId();
    const { hospitals, error } = await retrieveHospitalsByTrustId(
      authenticationToken.trustId
    );
    return {
      props: {
        error,
        hospitals,
      },
    };
  })
);

export default AddAWard;
