import React, { useState } from "react";
import { GridRow, GridColumn } from "../../../../../src/components/Grid";
import Layout from "../../../../../src/components/Layout";
import TrustAdminHeading from "../../../../../src/components/TrustAdminHeading";
import verifyTrustAdminToken from "../../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../../src/middleware/propsWithContainer";
import AddWardForm from "../../../../../src/components/AddWardForm";
import Error from "next/error";
import { TRUST_ADMIN } from "../../../../../src/helpers/userTypes";

const AddAWard = ({ organisation, error, hospital }) => {
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
      <TrustAdminHeading
        trustName={organisation.name}
        subHeading={hospital.name}
      />
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
  verifyTrustAdminToken(async ({ container, authenticationToken, params }) => {
    const orgId = authenticationToken.trustId;
    const facilityUuid = params.hospitalUuid;
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);
    const {
      facility,
      error: facilityError,
    } = await container.getRetrieveFacilityByUuid()(facilityUuid);

    const { id, uuid, name, code } = facility;
    return {
      props: {
        error: organisationError || facilityError,
        hospital: { id, uuid, name, code },
        organisation,
      },
    };
  })
);

export default AddAWard;
