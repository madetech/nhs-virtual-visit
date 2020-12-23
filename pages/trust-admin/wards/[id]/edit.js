import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import EditWardForm from "../../../../src/components/EditWardForm";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

const EditAWard = ({ trust, error, ward, hospitals }) => {
  console.log(ward);
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
      <TrustAdminHeading trustName={trust.name} subHeading={hospital.name} />
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
    const getRetrieveWardById = container.getRetrieveWardById();
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const { ward, error } = await getRetrieveWardById(
      query.id,
      authenticationToken.trustId
    );

    const retrieveHospitalsByTrustId = container.getRetrieveHospitalsByTrustId();
    const retrieveHospitalsResponse = await retrieveHospitalsByTrustId(
      authenticationToken.trustId
    );
    console.log(retrieveHospitalsResponse.hospitals);
    if (error) {
      return { props: { error: error } };
    } else {
      return {
        props: {
          error: error,
          ward: ward,
          hospitals: retrieveHospitalsResponse.hospitals,
          trust: { name: trustResponse.trust?.name },
        },
      };
    }
  })
);

export default EditAWard;
