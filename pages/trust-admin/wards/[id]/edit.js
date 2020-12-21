import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import EditWardForm from "../../../../src/components/EditWardForm";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

const EditAWard = ({ trust, error, id, name, hospitalId, hospitals }) => {

  if (error) {
    return <Error />;
  }

  const [errors, setErrors] = useState([]);
  const hospital = hospitals.find((hospital) => hospital.id == hospitalId);

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
            id={id}
            initialName={name}
            hospitalId={hospitalId}
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

    let error = null;
    const getRetrieveWardByIdResponse = await getRetrieveWardById(
      query.id,
      authenticationToken.trustId
    );
    error = error || getRetrieveWardByIdResponse.error;

    if (error) {
      return { props: { error: error } };
    } else {
      return {
        props: {
          error: error,
          id: getRetrieveWardByIdResponse.ward.id,
          name: getRetrieveWardByIdResponse.ward.name,
          hospitalId: getRetrieveWardByIdResponse.ward.hospitalId,
          hospitals: retrieveHospitalsResponse.hospitals,
          trust: { name: trustResponse.trust?.name },
        },
      };
    }
  })
);

export default EditAWard;
