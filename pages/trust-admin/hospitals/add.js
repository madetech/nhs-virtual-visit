import React, { useState } from "react";
import Error from "next/error";
import Router from "next/router";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";
import EditHospitalForm from "../../../src/components/EditHospitalForm";

const AddAHospital = ({ error, trustId }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);

  const onSubmitErrors = [];

  const setHospitalUniqueError = (errors, err) => {
    errors.push({
      id: "hospital-name-error",
      message: err,
    });
  };

  const submit = async (payload) => {
    payload.trustId = trustId;
    const response = await fetch("/api/create-hospital", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const status = response.status;

    if (status == 201) {
      const { hospitalId } = await response.json();
      Router.push({
        pathname: `/trust-admin/hospitals/${hospitalId}/add-success`,
      });
    } else if (status === 400) {
      const { err } = await response.json();
      setHospitalUniqueError(onSubmitErrors, err);
    } else {
      onSubmitErrors.push({
        message: "Something went wrong, please try again later.",
      });
      setErrors(onSubmitErrors);
    }
  };

  return (
    <Layout
      title="Add a hospital"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <EditHospitalForm
            errors={errors}
            setErrors={setErrors}
            hospital={{}}
            submit={submit}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ authenticationToken }) => {
    const trustId = authenticationToken.trustId;
    return {
      props: {
        trustId,
      },
    };
  })
);

export default AddAHospital;
