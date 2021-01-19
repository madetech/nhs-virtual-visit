import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import EditWardForm from "../../../../src/components/EditWardForm";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

const EditAWard = ({ organisation, error, ward, hospitals }) => {
  if (error) {
    return <Error />;
  }

  const [errors, setErrors] = useState([]);
  const hospital = hospitals.find((hosp) => hosp.id == ward.hospitalId);

  return (
    <Layout
      title="Edit a ward"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={organisation.name}
        subHeading={hospital.name}
      />
      <GridRow>
        <GridColumn width="two-thirds">
          <EditWardForm
            errors={errors}
            setErrors={setErrors}
            id={ward.id}
            initialName={ward.name}
            hospitalId={ward.hospitalId}
            status={ward.status}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const orgId = authenticationToken.trustId;
    const getRetrieveWardById = container.getRetrieveWardById();
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);
    const { ward, error: wardError } = await getRetrieveWardById(
      query.id,
      orgId
    );

    const {
      hospitals,
      error: hospitalsError,
    } = await container.getRetrieveHospitalsByTrustId()(orgId);

    return {
      props: {
        error: organisationError || wardError || hospitalsError,
        ward,
        hospitals,
        organisation,
      },
    };
  })
);

export default EditAWard;
