import React, { useState } from "react";
import Error from "next/error";
import Router from "next/router";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import TrustManagerForm from "../../../../src/components/TrustManagerForm";
import ErrorSummary from "../../../../src/components/ErrorSummary";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

const EditTrustManager = ({ error, trustManager, trust }) => {
  if (error) {
    return <Error err={error} />;
  }
  console.log();
  const [errors, setErrors] = useState([]);
  const submit = async (payload) => {
    payload.uuid = trustManager.uuid;

    try {
      const response = await fetch("/api/update-a-trust-manager-status", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        const json = await response.json();
        Router.push({
          pathname: `/trust-admin/trust-managers/${json.uuid}/edit-success`,
          query: { uuid: trustManager.uuid },
        });
      } else {
        throw new Error(response.status);
      }
    } catch (e) {
      const onSubmitErrors = [
        {
          id: "trust-manager-update-error",
          message: "There was a problem saving your changes",
        },
      ];
      setErrors(onSubmitErrors);
    }
  };

  return (
    <Layout
      title="Edit a Trust Manager"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading="Trust Managers" />
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <TrustManagerForm
            errors={errors}
            setErrors={setErrors}
            trustManager={trustManager}
            submit={submit}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ authenticationToken, container, query }) => {
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const orgManagerUuid = query.uuid;
    const {
      trustManager,
      error,
    } = await container.getRetrieveOrgManagerByUuid()(orgManagerUuid);

    return {
      props: {
        trustManager,
        trust: { name: trustResponse.trust?.name },
        error,
      },
    };
  })
);

export default EditTrustManager;
