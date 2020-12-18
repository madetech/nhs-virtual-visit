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
import TrustAdminHeading from "../../../src/components/TrustAdminHeading";

const AddAHospital = ({ trust, error, trustId }) => {
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
      id: "generic-error",
      message: "Something went wrong, please try again later.",
    };
  };

  const submit = async (payload) => {
    console.log(payload);
    payload.trustId = trustId;
    try {
      const response = await fetch("/api/create-hospital", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error({ ...json, status: response.status });
      }

      Router.push(
        "/trust-admin/hospitals/[id]/add-success",
        `/trust-admin/hospitals/${json.hospitalId}/add-success`
      );

      return true;
    } catch (e) {
      const submitErrors = [
        e.props.status === 400
          ? getHospitalUniqueError(error.props.err)
          : getGenericError(),
      ];
      setErrors(submitErrors);
    }

    return false;
  };

  return (
    <Layout
      title="Add a hospital"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading="Hospitals" />
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
  verifyTrustAdminToken(async ({ authenticationToken, container }) => {
    const trustId = authenticationToken.trustId;
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    return {
      props: {
        trustId,
        trust: { name: trustResponse.trust?.name },
      },
    };
  })
);

export default AddAHospital;
