import React, { useState } from "react";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import AddWardForm from "../../../src/components/AddWardForm";
import Error from "next/error";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const AddAWard = ({ hospitals, error, hospitalId }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);

  return (
    <Layout
      title="Add a ward"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <AddWardForm
            errors={errors}
            setErrors={setErrors}
            hospitals={hospitals}
            defaultHospitalId={hospitalId}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, authenticationToken, query }) => {
    const retrieveHospitalsByTrustId = container.getRetrieveHospitalsByTrustId();
    const { hospitals, error } = await retrieveHospitalsByTrustId(
      authenticationToken.trustId
    );
    const hospitalId = query.hospitalId || null;

    return {
      props: {
        error,
        hospitals,
        hospitalId,
      },
    };
  })
);

export default AddAWard;
