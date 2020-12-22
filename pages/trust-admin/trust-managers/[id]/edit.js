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

  const [errors, setErrors] = useState([]);
  const submit = () => {
    Router.push({
      pathname: "/trust-admin/trust-managers/[id]/edit-success",
      query: { id: trustManager.id },
    });
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
    const trustManagerId = query.id;

    const trustManagers = [
      {
        id: "1",
        email: "abc@nhs.co.uk",
        status: "active",
      },
      {
        id: "2",
        email: "def@nhs.co.uk",
        status: "active",
      },
      {
        id: "3",
        email: "ghi@nhs.co.uk",
        status: "active",
      },
    ];
    const trustManager = trustManagers?.find(
      (manager) => manager.id === trustManagerId
    );
    const error = "";
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
