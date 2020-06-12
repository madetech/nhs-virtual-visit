import React, { useState } from "react";
import Error from "next/error";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import EditHospitalForm from "../../../../src/components/EditHospitalForm";

const EditHospital = ({ hospital, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  const [errors, setErrors] = useState([]);

  return (
    <Layout
      title="Edit a hospital"
      hasErrors={errors.length != 0}
      renderLogout={true}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <EditHospitalForm
            errors={errors}
            setErrors={setErrors}
            hospital={hospital}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ authenticationToken, container, query }) => {
    const { id: hospitalId } = query;
    const trustId = authenticationToken.trustId;

    const {
      hospital,
      error: hospitalError,
    } = await container.getRetrieveHospitalById()(hospitalId, trustId);

    return {
      props: {
        hospital,
        error: hospitalError,
      },
    };
  })
);

export default EditHospital;
