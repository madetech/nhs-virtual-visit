import React, { useState } from "react";
import Error from "next/error";
import Router from "next/router";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";
import HospitalForm from "../../../src/components/HospitalForm";
import ErrorSummary from "../../../src/components/ErrorSummary";
import TrustAdminHeading from "../../../src/components/TrustAdminHeading";

const AddAHospital = ({ organisation, error }) => {
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
    payload.orgId = organisation.id;
    try {
      const response = await fetch("/api/create-facility", {
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
        "/trust-admin/hospitals/[uuid]/add-hospital-success",
        `/trust-admin/hospitals/${json.uuid}/add-hospital-success`
      );

      return true;
    } catch (e) {
      const submitErrors = [
        e.props.status === 400
          ? getHospitalUniqueError(e.props.err)
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
      <TrustAdminHeading trustName={organisation.name} subHeading="Hospitals" />
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <HospitalForm errors={errors} setErrors={setErrors} submit={submit} />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ authenticationToken, container }) => {
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(
      authenticationToken.trustId
    );

    return {
      props: {
        error: organisationError,
        organisation,
      },
    };
  })
);

export default AddAHospital;
