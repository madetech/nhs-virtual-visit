import React, { useState } from "react";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import TrustAdminHeading from "../../../src/components/TrustAdminHeading";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import AddWardForm from "../../../src/components/AddWardForm";
import Error from "next/error";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const AddAWard = ({ trust, hospitals, error, hospitalId }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);
  const hospital = hospitals.find((hosp) => hosp.id == hospitalId);

  return (
    <Layout
      title="Add a ward"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading={hospital.name} />
      <GridRow>
        <GridColumn width="two-thirds">
          <AddWardForm
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
  verifyTrustAdminToken(async ({ container, authenticationToken, query }) => {
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    let error = null;
    const hospitalId = query.hospitalId || null;
    const retrieveHospitalsByTrustId = container.getRetrieveHospitalsByTrustId;
    const retrieveHospitalsResponse = await retrieveHospitalsByTrustId(
      authenticationToken.trustId
    );

    error = error || retrieveHospitalsResponse.error;

    if (error) {
      return { props: { error: error } };
    } else {
      return {
        props: {
          error: error,
          hospitals: retrieveHospitalsResponse.hospitals,
          hospitalId,
          trust: { name: trustResponse.trust?.name },
        },
      };
    }
  })
);

export default AddAWard;
