import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../../../src/components/Grid";
import Layout from "../../../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../../../src/middleware/propsWithContainer";
import EditWardForm from "../../../../../../src/components/EditWardForm";
import { TRUST_ADMIN } from "../../../../../../src/helpers/userTypes";
import TrustAdminHeading from "../../../../../../src/components/TrustAdminHeading";

const EditAWard = ({ organisation, error, ward, hospital }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);

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
            ward={ward}
            hospital={hospital}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, params, authenticationToken }) => {
    const orgId = authenticationToken.trustId;
    const { hospitalUuid, wardUuid } = params;
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);

    const {
      department,
      error: departmentError,
    } = await container.getRetrieveDepartmentByUuid()(wardUuid);
    const {
      facility,
      error: facilityError,
    } = await container.getRetrieveFacilityByUuid()(hospitalUuid);
    return {
      props: {
        error: organisationError || departmentError || facilityError,
        ward: department,
        hospital: facility,
        organisation,
      },
    };
  })
);

export default EditAWard;
