import React, { useState } from "react";
import Error from "next/error";
import Router from "next/router";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import EditHospitalForm from "../../../../src/components/EditHospitalForm";
import ErrorSummary from "../../../../src/components/ErrorSummary";

const EditHospital = ({ hospital, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  const [errors, setErrors] = useState([]);

  const submit = async (payload) => {
    payload.id = hospital.id;
    await fetch("/api/update-a-hospital", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((result) =>
        Router.push(
          "/trust-admin/hospitals/[id]/edit-success",
          `/trust-admin/hospitals/${result.hospitalId}/edit-success`
        )
      )
      .catch(() => {
        const onSubmitErrors = [
          {
            id: "hospital-update-error",
            message: "There was a problem saving your changes",
          },
        ];
        setErrors(onSubmitErrors);
      });
  };

  return (
    <Layout
      title="Edit a hospital"
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
            hospital={hospital}
            submit={submit}
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
