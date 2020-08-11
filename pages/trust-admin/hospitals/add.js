import React, { useState } from "react";
import Error from "next/error";
import Router from "next/router";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";
import EditHospitalForm from "../../../src/components/EditHospitalForm";
import ErrorSummary from "../../../src/components/ErrorSummary";

const AddAHospital = ({ error, trustId }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);

  const getHospitalUniqueError = (err) => {
    return {
      id: "hospital-name-error",
      message: err,
    };
  };

  const getGenericError = () => {
    return {
      message: "Something went wrong, please try again later.",
    };
  };

  const submit = async (payload) => {
    payload.trustId = trustId;
    await fetch("/api/create-hospital", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok && response.status !== 201)
          throw new Error({ ...json, status: response.status });
        return json;
      })
      .then((response) =>
        Router.push(
          "/trust-admin/hospitals/[id]/add-success",
          `/trust-admin/hospitals/${response.hospitalId}/add-success`
        )
      )
      .catch((e) => {
        let submitErrors = [
          e.props.status === 400
            ? getHospitalUniqueError(e.props.err)
            : getGenericError(),
        ];
        setErrors(submitErrors);
      });
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
          <ErrorSummary errors={errors} />
          <EditHospitalForm
            errors={errors}
            setErrors={setErrors}
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
